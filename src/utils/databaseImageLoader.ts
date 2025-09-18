// Database-based image loader for Neon database
import {
  getCategories,
  createCategory,
  type Category,
} from "../api/categories";
import {
  getFlashCardsByCategory,
  createFlashCard,
  updateFlashCard,
  getFlashCardByNameAndCategory,
  type FlashCard,
} from "../api/flashCards";
import { initializeDatabase } from "../lib/database";

export interface DynamicFlashCard {
  id: string;
  name: string;
  image: string;
  category: string;
  categoryDisplayName: string;
}

export interface DynamicCategory {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  folder: string;
  imageCount: number;
}

// Convert database category to dynamic category
const convertCategory = (dbCategory: Category): DynamicCategory => ({
  id: dbCategory.name,
  name: dbCategory.name,
  displayName: dbCategory.display_name,
  description: dbCategory.description,
  icon: dbCategory.icon,
  color: dbCategory.color,
  folder: dbCategory.folder,
  imageCount: dbCategory.image_count || 0,
});

// Convert database flash card to dynamic flash card
const convertFlashCard = (dbFlashCard: FlashCard): DynamicFlashCard => ({
  id: dbFlashCard.id.toString(),
  name: dbFlashCard.name,
  image: dbFlashCard.image_url,
  category: dbFlashCard.category_id.toString(),
  categoryDisplayName: dbFlashCard.category_display_name || "",
});

// Initialize database on module load
let isInitialized = false;
const initDatabase = async () => {
  if (!isInitialized) {
    try {
      await initializeDatabase();
      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
};

// Get all available categories
export const getAvailableCategories = async (): Promise<DynamicCategory[]> => {
  try {
    await initDatabase();
    const categories = await getCategories();
    return categories.map(convertCategory);
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
};

// Get flash cards for a specific category
export const getFlashCardsForCategory = async (
  categoryId: string
): Promise<DynamicFlashCard[]> => {
  try {
    await initDatabase();

    // Find category by name (since we use name as ID)
    const categories = await getCategories();
    const category = categories.find((cat) => cat.name === categoryId);

    if (!category) {
      console.warn(`No category found for ID: ${categoryId}`);
      return [];
    }

    const flashCards = await getFlashCardsByCategory(category.id);
    return flashCards.map(convertFlashCard);
  } catch (error) {
    console.error("Error loading flash cards:", error);
    return [];
  }
};

// Add a new category (for admin use)
export const addNewCategory = async (categoryData: {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  folder: string;
}): Promise<boolean> => {
  try {
    await initDatabase();

    await createCategory({
      name: categoryData.name,
      display_name: categoryData.displayName,
      description: categoryData.description,
      icon: categoryData.icon,
      color: categoryData.color,
      folder: categoryData.folder,
    });

    return true;
  } catch (error) {
    console.error("Error adding category:", error);
    return false;
  }
};

// Add a new flash card (for admin use)
export const addNewFlashCard = async (cardData: {
  name: string;
  category: string;
  image: File;
}): Promise<boolean> => {
  try {
    await initDatabase();

    // Find category by folder name (since admin modal passes folder names)
    const categories = await getCategories();
    const category = categories.find((cat) => cat.folder === cardData.category);

    if (!category) {
      console.error(`Category ${cardData.category} not found`);
      return false;
    }

    // Generate filename from the entered name (for future use)
    // const fileExt = cardData.image.name.split(".").pop()?.toLowerCase() || "png";
    // const cleanName = cardData.name
    //   .toLowerCase()
    //   .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    //   .replace(/\s+/g, "_") // Replace spaces with underscores
    //   .trim();
    // const fileName = `${cleanName}.${fileExt}`;

    // Convert image to base64 for storage (browser-compatible)
    const imageBuffer = await cardData.image.arrayBuffer();
    const uint8Array = new Uint8Array(imageBuffer);
    const base64Image = btoa(String.fromCharCode(...uint8Array));
    const imageUrl = `data:${cardData.image.type};base64,${base64Image}`;

    await createFlashCard({
      name: cardData.name,
      image_url: imageUrl,
      image_data: uint8Array, // Use Uint8Array instead of Buffer
      category_id: category.id,
    });
    return true;
  } catch (error) {
    console.error("Error adding flash card:", error);
    return false;
  }
};

// Update an existing flash card (for admin use)
export const updateExistingFlashCard = async (cardData: {
  id: number;
  name: string;
  category: string;
  image?: File;
}): Promise<boolean> => {
  try {
    await initDatabase();

    // Find category by folder name
    const categories = await getCategories();
    const category = categories.find((cat) => cat.folder === cardData.category);

    if (!category) {
      console.error(`Category ${cardData.category} not found`);
      return false;
    }

    let updateData: any = {
      name: cardData.name,
      category_id: category.id,
    };

    // If new image is provided, process it
    if (cardData.image) {
      const imageBuffer = await cardData.image.arrayBuffer();
      const uint8Array = new Uint8Array(imageBuffer);
      const base64Image = btoa(String.fromCharCode(...uint8Array));
      const imageUrl = `data:${cardData.image.type};base64,${base64Image}`;

      updateData.image_url = imageUrl;
      updateData.image_data = uint8Array;
    }

    await updateFlashCard(cardData.id, updateData);
    return true;
  } catch (error) {
    console.error("Error updating flash card:", error);
    return false;
  }
};

// Get flash card for editing
export const getFlashCardForEdit = async (
  name: string,
  category: string
): Promise<DynamicFlashCard | null> => {
  try {
    await initDatabase();

    const categories = await getCategories();
    const categoryObj = categories.find((cat) => cat.folder === category);

    if (!categoryObj) {
      return null;
    }

    const flashCard = await getFlashCardByNameAndCategory(name, categoryObj.id);
    if (!flashCard) {
      return null;
    }

    return convertFlashCard(flashCard);
  } catch (error) {
    console.error("Error getting flash card for edit:", error);
    return null;
  }
};

// Debug function to see current categories
export const debugCategories = async () => {
  try {
    await initDatabase();
    const categories = await getCategories();
    console.log("Current categories from database:", categories);
    return categories;
  } catch (error) {
    console.error("Error debugging categories:", error);
    return [];
  }
};
