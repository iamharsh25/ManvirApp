import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type DynamicFlashCard,
  getFlashCardsForCategory,
} from "../../utils/imageLoader";
import { DAILY_NAME } from "../../config/nameConfig";

interface DynamicFlashCardGameProps {
  categoryId: string;
  onBack: () => void;
}

export default function DynamicFlashCardGame({
  categoryId,
  onBack,
}: DynamicFlashCardGameProps) {
  const [cards, setCards] = useState<DynamicFlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showName, setShowName] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentCard = cards[currentCardIndex];
  const isLastCard = currentCardIndex === cards.length - 1;

  useEffect(() => {
    loadCards();
  }, [categoryId]);

  const loadCards = async () => {
    setLoading(true);
    try {
      const loadedCards = await getFlashCardsForCategory(categoryId);
      setCards(loadedCards);
      setCurrentCardIndex(0);
      setShowName(false);
      setScore(0);
      setGameComplete(false);
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!showName) {
      setShowName(true);
    }
  };

  const handleNext = () => {
    if (isLastCard) {
      setGameComplete(true);
    } else {
      setCurrentCardIndex((prev) => prev + 1);
      setShowName(false);
    }
  };

  const handleCorrect = () => {
    setScore((prev) => prev + 1);
    handleNext();
  };

  const handleWrong = () => {
    handleNext();
  };

  const resetGame = () => {
    setCurrentCardIndex(0);
    setShowName(false);
    setScore(0);
    setGameComplete(false);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading flash cards...</p>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Great job, {DAILY_NAME}!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            You got {score} out of {cards.length} correct!
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again
            </motion.button>
            <motion.button
              onClick={onBack}
              className="px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Categories
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No cards found
          </h3>
          <p className="text-gray-600 mb-6">
            This category doesn't have any flash cards yet.
          </p>
          <motion.button
            onClick={onBack}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Categories
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        key={currentCardIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Flash Card */}
        <motion.div
          className="relative w-full h-80 rounded-3xl shadow-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600"
          onClick={handleCardClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Image Display */}
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-white">
            <motion.div
              className="w-48 h-48 mb-4 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img
                src={currentCard.image}
                alt={currentCard.name}
                className="w-40 h-40 object-contain rounded-xl"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden text-8xl">
                {currentCard.name === "BMW"
                  ? "🚗"
                  : currentCard.name === "Mercedes"
                  ? "🚙"
                  : currentCard.name === "Audi"
                  ? "🚘"
                  : currentCard.name === "Toyota"
                  ? "🚗"
                  : currentCard.name === "Happy"
                  ? "😊"
                  : currentCard.name === "Sad"
                  ? "😢"
                  : currentCard.name === "Angry"
                  ? "😠"
                  : currentCard.name === "Excited"
                  ? "🤩"
                  : currentCard.name === "Sunny"
                  ? "☀️"
                  : currentCard.name === "Rainy"
                  ? "🌧️"
                  : currentCard.name === "Snowy"
                  ? "❄️"
                  : currentCard.name === "Cloudy"
                  ? "☁️"
                  : "📷"}
              </div>
            </motion.div>

            {/* Name Display - Only shown when clicked */}
            <AnimatePresence>
              {showName && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
                    {currentCard.name}
                  </h2>
                  <p className="text-lg opacity-90">
                    {isLastCard ? "Last card!" : "Click Next to continue"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instruction when name is not shown */}
            {!showName && (
              <motion.p
                className="text-lg opacity-90"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to see the name
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Card Navigation */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Card {currentCardIndex + 1} of {cards.length}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentCardIndex + 1) / cards.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Action Buttons - Only show when name is revealed */}
          <AnimatePresence>
            {showName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 justify-center"
              >
                <motion.button
                  onClick={handleWrong}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Wrong
                </motion.button>
                <motion.button
                  onClick={handleCorrect}
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Correct
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLastCard ? "Finish" : "Next"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
