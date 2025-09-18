import { sql } from "../lib/database";

export interface FlashCard {
  id: number;
  name: string;
  image_url: string;
  image_data?: Uint8Array;
  category_id: number;
  created_at: string;
  updated_at: string;
  category_display_name?: string;
}

// Get flash cards by category ID
export const getFlashCardsByCategory = async (
  categoryId: number
): Promise<FlashCard[]> => {
  try {
    const flashCards = await sql`
      SELECT 
        fc.*,
        c.display_name as category_display_name
      FROM flash_cards fc
      JOIN categories c ON fc.category_id = c.id
      WHERE fc.category_id = ${categoryId}
      ORDER BY fc.name
    `;

    return flashCards as FlashCard[];
  } catch (error) {
    console.error("Error fetching flash cards:", error);
    throw error;
  }
};

// Get flash card by ID
export const getFlashCardById = async (
  id: number
): Promise<FlashCard | null> => {
  try {
    const [flashCard] = await sql`
      SELECT 
        fc.*,
        c.display_name as category_display_name
      FROM flash_cards fc
      JOIN categories c ON fc.category_id = c.id
      WHERE fc.id = ${id}
    `;

    return (flashCard || null) as FlashCard | null;
  } catch (error) {
    console.error("Error fetching flash card:", error);
    throw error;
  }
};

// Create new flash card
export const createFlashCard = async (flashCardData: {
  name: string;
  image_url: string;
  image_data?: Uint8Array;
  category_id: number;
}): Promise<FlashCard> => {
  try {
    const [flashCard] = await sql`
      INSERT INTO flash_cards (name, image_url, image_data, category_id)
      VALUES (${flashCardData.name}, ${flashCardData.image_url}, ${flashCardData.image_data}, ${flashCardData.category_id})
      RETURNING *
    `;

    return flashCard as FlashCard;
  } catch (error) {
    console.error("Error creating flash card:", error);
    throw error;
  }
};

// Update flash card
export const updateFlashCard = async (
  id: number,
  flashCardData: Partial<FlashCard>
): Promise<FlashCard | null> => {
  try {
    const [flashCard] = await sql`
      UPDATE flash_cards 
      SET 
        name = COALESCE(${flashCardData.name}, name),
        image_url = COALESCE(${flashCardData.image_url}, image_url),
        image_data = COALESCE(${flashCardData.image_data}, image_data),
        category_id = COALESCE(${flashCardData.category_id}, category_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    return (flashCard || null) as FlashCard | null;
  } catch (error) {
    console.error("Error updating flash card:", error);
    throw error;
  }
};

// Delete flash card
export const deleteFlashCard = async (id: number): Promise<boolean> => {
  try {
    await sql`DELETE FROM flash_cards WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error("Error deleting flash card:", error);
    throw error;
  }
};

// Get all flash cards
export const getAllFlashCards = async (): Promise<FlashCard[]> => {
  try {
    const flashCards = await sql`
      SELECT 
        fc.*,
        c.display_name as category_display_name
      FROM flash_cards fc
      JOIN categories c ON fc.category_id = c.id
      ORDER BY c.display_name, fc.name
    `;

    return flashCards as FlashCard[];
  } catch (error) {
    console.error("Error fetching all flash cards:", error);
    throw error;
  }
};

// Get flash card by name and category for editing
export const getFlashCardByNameAndCategory = async (
  name: string,
  categoryId: number
): Promise<FlashCard | null> => {
  try {
    const [flashCard] = await sql`
      SELECT 
        fc.*,
        c.display_name as category_display_name
      FROM flash_cards fc
      JOIN categories c ON fc.category_id = c.id
      WHERE fc.name = ${name} AND fc.category_id = ${categoryId}
    `;

    return (flashCard || null) as FlashCard | null;
  } catch (error) {
    console.error("Error fetching flash card by name and category:", error);
    throw error;
  }
};
