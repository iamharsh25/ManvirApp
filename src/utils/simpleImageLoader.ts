// Simple image loader that works without database
// This is a fallback system until you set up Neon database

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

// Simple in-memory storage (will reset on page refresh)
let SIMPLE_CATEGORIES: Record<string, string[]> = {
  "Car Logo": ["bmw_logo.jpg", "mercedes_logo.jpg"],
  Mood: ["angry.png", "excited.png", "happy.png", "sad.png"],
  Weather: ["cloudy.png", "rainy.png", "snowy.png", "sunny.png"],
};

// Get all available categories
export const getAvailableCategories = async (): Promise<DynamicCategory[]> => {
  try {
    const categories: DynamicCategory[] = [];

    for (const [folderName, images] of Object.entries(SIMPLE_CATEGORIES)) {
      const category: DynamicCategory = {
        id: folderName.toLowerCase().replace(/\s+/g, "-"),
        name: folderName.toLowerCase().replace(/\s+/g, "-"),
        displayName: folderName,
        description: `Learn about ${folderName.toLowerCase()}`,
        icon: getCategoryIcon(folderName),
        color: getCategoryColor(folderName),
        folder: folderName,
        imageCount: images.length,
      };
      categories.push(category);
    }

    return categories;
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
    const folderName = Object.keys(SIMPLE_CATEGORIES).find(
      (folder) => folder.toLowerCase().replace(/\s+/g, "-") === categoryId
    );

    if (!folderName) {
      console.warn(`No category found for ID: ${categoryId}`);
      return [];
    }

    const images = SIMPLE_CATEGORIES[folderName] || [];
    return images.map((imageName, index) => {
      const name = imageName.replace(/\.(png|jpg|jpeg|gif|webp)$/i, "");
      return {
        id: `${folderName.toLowerCase()}_${index + 1}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        image: `/Resources/FlashCards/${folderName}/${imageName}`,
        category: categoryId,
        categoryDisplayName: folderName,
      };
    });
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
    SIMPLE_CATEGORIES[categoryData.folder] = [];
    console.log(`Category "${categoryData.displayName}" added successfully!`);
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
    // Find the folder name for this category
    const folderName = Object.keys(SIMPLE_CATEGORIES).find(
      (folder) =>
        folder.toLowerCase().replace(/\s+/g, "-") === cardData.category
    );

    if (!folderName) {
      console.error(`Category ${cardData.category} not found`);
      return false;
    }

    // Generate filename from the entered name
    const fileExt =
      cardData.image.name.split(".").pop()?.toLowerCase() || "png";
    const cleanName = cardData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .trim();

    const fileName = `${cleanName}.${fileExt}`;

    // Add to simple storage
    if (!SIMPLE_CATEGORIES[folderName]) {
      SIMPLE_CATEGORIES[folderName] = [];
    }
    SIMPLE_CATEGORIES[folderName].push(fileName);

    console.log(`Flash card "${cardData.name}" added successfully!`);
    console.log(`File should be saved as: ${fileName}`);
    console.log(`Path: /Resources/FlashCards/${folderName}/${fileName}`);

    return true;
  } catch (error) {
    console.error("Error adding flash card:", error);
    return false;
  }
};

// Debug function
export const debugCategories = () => {
  console.log("Current categories:", SIMPLE_CATEGORIES);
  return SIMPLE_CATEGORIES;
};

// Helper functions
function getCategoryIcon(folderName: string): string {
  const icons: Record<string, string> = {
    "Car Logo": "🚗",
    Mood: "😊",
    Weather: "☀️",
  };
  return icons[folderName] || "📁";
}

function getCategoryColor(folderName: string): string {
  const colors: Record<string, string> = {
    "Car Logo": "from-blue-500 to-blue-700",
    Mood: "from-yellow-500 to-orange-500",
    Weather: "from-cyan-500 to-blue-500",
  };
  return colors[folderName] || "from-purple-500 to-pink-600";
}
