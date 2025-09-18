import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAILY_NAME } from "../config/nameConfig";

interface AlphabetGameProps {
  onComplete: () => void;
}

export default function AlphabetGame({ onComplete }: AlphabetGameProps) {
  const fullName = DAILY_NAME;
  const [currentWord, setCurrentWord] = useState("");
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showAlphabets, setShowAlphabets] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Initialize game with random missing letters
  useEffect(() => {
    const positions = [0, 1, 2, 3, 4, 5]; // All positions
    const shuffled = positions.sort(() => Math.random() - 0.5);
    const missingCount = Math.floor(Math.random() * 3) + 2; // 2-4 missing letters
    const missing = shuffled.slice(0, missingCount).sort((a, b) => a - b);

    setMissingPositions(missing);

    // Create word with blanks
    let wordWithBlanks = "";
    for (let i = 0; i < fullName.length; i++) {
      if (missing.includes(i)) {
        wordWithBlanks += "_";
      } else {
        wordWithBlanks += fullName[i];
      }
    }
    setCurrentWord(wordWithBlanks);

    // Initialize user input array
    setUserInput(new Array(missing.length).fill(""));
  }, []);

  useEffect(() => {
    // Show alphabets after word animation
    const timer = setTimeout(() => {
      setShowAlphabets(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = (letter: string) => {
    if (isComplete) return;

    // Find the first empty position
    const emptyIndex = userInput.findIndex((input) => input === "");
    if (emptyIndex === -1) return;

    // Update user input
    const newUserInput = [...userInput];
    newUserInput[emptyIndex] = letter;
    setUserInput(newUserInput);

    // Update the word display
    const newWord = currentWord.split("");
    const missingIndex = missingPositions[emptyIndex];
    newWord[missingIndex] = letter;
    setCurrentWord(newWord.join(""));

    // Check if all blanks are filled
    if (newUserInput.every((input) => input !== "")) {
      setShowDoneButton(true);
    }
  };

  const handleDone = () => {
    // Check if all letters are correct
    const isCorrect = userInput.every((letter, index) => {
      const missingIndex = missingPositions[index];
      return letter === fullName[missingIndex];
    });

    if (isCorrect) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      // Show shake animation for wrong answer
      const element = document.getElementById("word-display");
      if (element) {
        element.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
          element.style.animation = "";
        }, 500);
      }
    }
  };

  const handleKeyboardInput = (e: KeyboardEvent) => {
    const letter = e.key.toUpperCase();
    if (alphabet.includes(letter)) {
      handleKeyPress(letter);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardInput);
    return () => window.removeEventListener("keydown", handleKeyboardInput);
  }, [userInput, missingPositions]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Title Animation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-12"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manveer's Learning Hub
        </h1>
      </motion.div>

      {/* Word Display */}
      <motion.div
        id="word-display"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <div className="flex space-x-4 text-8xl font-bold text-gray-800">
          {currentWord.split("").map((char, index) => (
            <motion.span
              key={index}
              className={`${
                char === "_" ? "text-red-400 animate-pulse" : "text-green-600"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center mb-8"
      >
        <p className="text-xl text-gray-600 mb-2">
          Complete your name by typing the missing letters
        </p>
        <p className="text-lg text-gray-500">
          Fill in the blanks to spell "{DAILY_NAME}"
        </p>
      </motion.div>

      {/* Alphabet Grid */}
      <AnimatePresence>
        {showAlphabets && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-6 gap-3 max-w-md"
          >
            {alphabet.map((letter) => {
              const isUsed = userInput.includes(letter);
              const isCorrect = userInput.some((input, index) => {
                const missingIndex = missingPositions[index];
                return input === letter && letter === fullName[missingIndex];
              });
              const isWrong = isUsed && !isCorrect;

              return (
                <motion.button
                  key={letter}
                  onClick={() => handleKeyPress(letter)}
                  disabled={isComplete}
                  className={`
                    w-12 h-12 rounded-xl font-bold text-lg transition-all duration-200
                    ${
                      isComplete
                        ? "bg-green-500 text-white"
                        : isCorrect
                        ? "bg-green-500 text-white"
                        : isWrong
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-100 hover:scale-105 shadow-lg"
                    }
                    ${isComplete ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                  whileHover={!isComplete ? { scale: 1.1 } : {}}
                  whileTap={!isComplete ? { scale: 0.95 } : {}}
                >
                  {letter}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done Button */}
      <AnimatePresence>
        {showDoneButton && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <motion.button
              onClick={handleDone}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Done
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="text-center"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🎉
            </motion.div>
            <p className="text-2xl font-bold text-green-600 mb-2">
              Perfect! You spelled your name correctly!
            </p>
            <p className="text-xl text-gray-600">
              Welcome to your play area, {DAILY_NAME}!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
