import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAILY_NAME } from "../config/nameConfig";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [currentWord, setCurrentWord] = useState("");
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showAlphabets, setShowAlphabets] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Initialize game with random missing letters
  useEffect(() => {
    const positions = Array.from({ length: DAILY_NAME.length }, (_, i) => i);
    const shuffled = positions.sort(() => Math.random() - 0.5);
    const missingCount = Math.floor(Math.random() * 3) + 2; // 2-4 missing letters
    const missing = shuffled.slice(0, missingCount).sort((a, b) => a - b);

    setMissingPositions(missing);

    // Create word with blanks
    let wordWithBlanks = "";
    for (let i = 0; i < DAILY_NAME.length; i++) {
      if (missing.includes(i)) {
        wordWithBlanks += "_";
      } else {
        wordWithBlanks += DAILY_NAME[i];
      }
    }
    setCurrentWord(wordWithBlanks);

    // Initialize user input array
    setUserInput(new Array(missing.length).fill(""));
  }, [attempts]); // Re-initialize on each attempt

  useEffect(() => {
    // Show alphabets after word animation
    const timer = setTimeout(() => {
      setShowAlphabets(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [attempts]);

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
      return letter === DAILY_NAME[missingIndex];
    });

    if (isCorrect) {
      setIsComplete(true);
      setTimeout(() => {
        onUnlock();
      }, 1500);
    } else {
      // Wrong answer - shake and reset
      setAttempts((prev) => prev + 1);
      setUserInput([]);
      setShowDoneButton(false);
      setShowAlphabets(false);

      const element = document.getElementById("lock-word-display");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      {/* Lock Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">🔒</span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">App Locked</h1>
        <p className="text-lg text-gray-600">Enter the name to unlock</p>
      </motion.div>

      {/* Word Display */}
      <motion.div
        id="lock-word-display"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <div className="flex space-x-4 text-6xl font-bold text-gray-800">
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
        transition={{ delay: 1 }}
        className="text-center mb-8"
      >
        <p className="text-lg text-gray-600 mb-2">
          Complete the name to unlock the app
        </p>
        <p className="text-sm text-gray-500">
          Fill in the blanks to spell "{DAILY_NAME}"
        </p>
        {attempts > 0 && (
          <p className="text-sm text-red-500 mt-2">
            Attempt {attempts + 1} - Try again!
          </p>
        )}
      </motion.div>

      {/* Alphabet Grid */}
      <AnimatePresence>
        {showAlphabets && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-6 gap-2 max-w-sm"
          >
            {alphabet.map((letter) => {
              const isUsed = userInput.includes(letter);
              const isCorrect = userInput.some((input, index) => {
                const missingIndex = missingPositions[index];
                return input === letter && letter === DAILY_NAME[missingIndex];
              });
              const isWrong = isUsed && !isCorrect;

              return (
                <motion.button
                  key={letter}
                  onClick={() => handleKeyPress(letter)}
                  disabled={isComplete}
                  className={`
                    w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200
                    ${
                      isComplete
                        ? "bg-green-500 text-white"
                        : isCorrect
                        ? "bg-green-500 text-white"
                        : isWrong
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-100 hover:scale-105 shadow-md"
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
            className="mt-6"
          >
            <motion.button
              onClick={handleDone}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Unlock
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
              className="text-5xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🔓
            </motion.div>
            <p className="text-xl font-bold text-green-600">
              Unlocked! Welcome back!
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
