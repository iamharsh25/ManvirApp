import { sql } from "../lib/database";

export interface Category {
  id: number;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
  folder: string;
  created_at: string;
  updated_at: string;
  image_count?: number;
}

// Get all categories with image counts
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await sql`
      SELECT 
        c.*,
        COUNT(fc.id) as image_count
      FROM categories c
      LEFT JOIN flash_cards fc ON c.id = fc.category_id
      GROUP BY c.id, c.name, c.display_name, c.description, c.icon, c.color, c.folder, c.created_at, c.updated_at
      ORDER BY c.display_name
    `;

    return categories.map((cat) => ({
      ...cat,
      image_count: parseInt(cat.image_count as string) || 0,
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const [category] = await sql`
      SELECT 
        c.*,
        COUNT(fc.id) as image_count
      FROM categories c
      LEFT JOIN flash_cards fc ON c.id = fc.category_id
      WHERE c.id = ${id}
      GROUP BY c.id, c.name, c.display_name, c.description, c.icon, c.color, c.folder, c.created_at, c.updated_at
    `;

    if (!category) return null;

    return {
      ...category,
      image_count: parseInt(category.image_count as string) || 0,
    } as Category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData: {
  name: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
  folder: string;
}): Promise<Category> => {
  try {
    const [category] = await sql`
      INSERT INTO categories (name, display_name, description, icon, color, folder)
      VALUES (${categoryData.name}, ${categoryData.display_name}, ${categoryData.description}, ${categoryData.icon}, ${categoryData.color}, ${categoryData.folder})
      RETURNING *
    `;

    return { ...category, image_count: 0 } as Category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update category
export const updateCategory = async (
  id: number,
  categoryData: Partial<Category>
): Promise<Category | null> => {
  try {
    const [category] = await sql`
      UPDATE categories 
      SET 
        name = COALESCE(${categoryData.name}, name),
        display_name = COALESCE(${categoryData.display_name}, display_name),
        description = COALESCE(${categoryData.description}, description),
        icon = COALESCE(${categoryData.icon}, icon),
        color = COALESCE(${categoryData.color}, color),
        folder = COALESCE(${categoryData.folder}, folder),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (!category) return null;

    return { ...category, image_count: 0 } as Category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
