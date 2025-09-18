import { useState } from "react";
import CategorySelection from "./CategorySelection";
import DynamicFlashCardGame from "./DynamicFlashCardGame";
import { type DynamicCategory } from "../../utils/imageLoader";

type GameState = "category-selection" | "playing";

export default function FlashCardGame() {
  const [gameState, setGameState] = useState<GameState>("category-selection");
  const [selectedCategory, setSelectedCategory] =
    useState<DynamicCategory | null>(null);

  const handleCategorySelect = (category: DynamicCategory) => {
    setSelectedCategory(category);
    setGameState("playing");
  };

  const handleBackToCategories = () => {
    setGameState("category-selection");
    setSelectedCategory(null);
  };

  if (gameState === "category-selection") {
    return <CategorySelection onCategorySelect={handleCategorySelect} />;
  }

  if (gameState === "playing" && selectedCategory) {
    return (
      <DynamicFlashCardGame
        categoryId={selectedCategory.id}
        onBack={handleBackToCategories}
      />
    );
  }

  return null;
}
