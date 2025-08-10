import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfettiBurst from "./ConfettiBurst";
import BubbleBackground from "./BubbleBackground";
import Mascot from "./Mascot";
import StarMeter from "./StarMeter";
import { loadVoices, speakLetter } from "./voice";

const UPPERCASE_LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);
const LOWERCASE_LETTERS = UPPERCASE_LETTERS.map((c) => c.toLowerCase());

function getShuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickTwoDistractors(correct: string): string[] {
  const pool = LOWERCASE_LETTERS.filter((c) => c !== correct);
  const shuffled = getShuffled(pool);
  return shuffled.slice(0, 2);
}

export default function AlphabetGame() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [confetti, setConfetti] = useState<boolean>(false);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [mood, setMood] = useState<"idle" | "happy" | "oops">("idle");

  const targetUpper = UPPERCASE_LETTERS[currentIndex];
  const correctLower = targetUpper.toLowerCase();

  useEffect(() => {
    loadVoices();
  }, []);

  const nextIndex = useCallback(() => {
    setCurrentIndex((idx) => (idx + 1) % UPPERCASE_LETTERS.length);
  }, []);

  useEffect(() => {
    const distractors = pickTwoDistractors(correctLower);
    const newOptions = getShuffled([correctLower, ...distractors]);
    setOptions(newOptions);
    setSelected(null);
    setIsCorrect(null);
    setMood("idle");
    // Removed voice prompt on load; it will only speak on click
  }, [currentIndex]);

  const handleSelect = useCallback(
    (choice: string) => {
      if (selected !== null) return;
      setSelected(choice);
      // Say the tapped letter name
      speakLetter(choice);
      const ok = choice === correctLower;
      setIsCorrect(ok);
      if (ok) {
        setMood("happy");
        setStars((s) => Math.min(5, s + 1));
        setConfetti(true);
        const timer = setTimeout(() => {
          setConfetti(false);
          nextIndex();
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        setMood("oops");
        setShakeKey((k) => k + 1);
        const timer = setTimeout(() => setIsCorrect(null), 650);
        return () => clearTimeout(timer);
      }
    },
    [selected, correctLower, nextIndex]
  );

  const title = useMemo(() => "Find the small letter", []);

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-sky-100 via-white to-sky-50 text-gray-900">
      <BubbleBackground />
      <ConfettiBurst isActive={!!confetti} />

      <div className="relative z-10 w-full max-w-md p-6 text-center">
        <div className="mb-4">
          <StarMeter earned={stars} />
        </div>

        <div className="mb-4">
          <Mascot mood={mood} />
        </div>

        <h1 className="text-xl font-semibold mb-4">{title}</h1>
        <div className="text-[8rem] leading-none font-extrabold text-sky-700 drop-shadow-sm select-none mb-3">
          {targetUpper}
        </div>
        <p className="text-gray-600 mb-6">Tap the matching small letter</p>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={shakeKey}
            initial={{ y: 0 }}
            animate={{
              x: isCorrect === false ? [0, -12, 12, -6, 6, -3, 3, 0] : 0,
            }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-3 gap-4 place-items-center"
          >
            {options.map((opt) => {
              const chosen = selected === opt;
              const base =
                "w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-black transition-all shadow hover:shadow-md";
              const normal =
                "bg-white hover:bg-sky-50 active:scale-95 border border-sky-100";
              const success = "bg-green-500 text-white scale-105";
              const danger = "bg-rose-500 text-white";

              const className =
                chosen && isCorrect === true
                  ? `${base} ${success}`
                  : chosen && isCorrect === false
                  ? `${base} ${danger}`
                  : `${base} ${normal}`;

              return (
                <button
                  key={opt}
                  aria-label={`Option ${opt}`}
                  onClick={() => handleSelect(opt)}
                  className={className}
                >
                  {opt}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-sm text-gray-400">
          {currentIndex + 1} / 26
        </div>
      </div>
    </div>
  );
}
