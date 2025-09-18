// Re-export from database image loader
export {
  getAvailableCategories,
  getFlashCardsForCategory,
  addNewCategory,
  addNewFlashCard,
  updateExistingFlashCard,
  getFlashCardForEdit,
  debugCategories,
  type DynamicFlashCard,
  type DynamicCategory,
} from "./databaseImageLoader";
