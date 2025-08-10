import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { loadVoices, speakText } from "../curiousmanvir/voice";

interface FlashItem {
  label: string;
  icon: string;
}

const ITEMS: FlashItem[] = [
  { label: "apple", icon: "twemoji:apple" },
  { label: "ball", icon: "twemoji:balloon" },
  { label: "cat", icon: "twemoji:cat" },
  { label: "dog", icon: "twemoji:dog" },
  { label: "sun", icon: "twemoji:sun" },
  { label: "moon", icon: "twemoji:crescent-moon" },
  { label: "train", icon: "twemoji:locomotive" },
  { label: "boat", icon: "twemoji:sailboat" },
  { label: "snake", icon: "twemoji:snake" },
  { label: "tiger", icon: "twemoji:tiger" },
  { label: "hat", icon: "twemoji:top-hat" },
  { label: "bag", icon: "twemoji:school-backpack" },
];

function randomIndex(exclude: number | null, max: number) {
  if (max <= 1) return 0;
  let idx = Math.floor(Math.random() * max);
  if (exclude !== null && idx === exclude) {
    idx = (idx + 1) % max;
  }
  return idx;
}

export default function FlashCards() {
  const [current, setCurrent] = useState<number>(
    randomIndex(null, ITEMS.length)
  );

  const showNext = useCallback(() => {
    setCurrent((prev) => randomIndex(prev, ITEMS.length));
  }, []);

  useEffect(() => {
    loadVoices();
  }, []);

  const item = useMemo(() => ITEMS[current], [current]);

  const onClick = useCallback(() => {
    speakText(item.label);
    showNext();
  }, [item, showNext]);

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-fuchsia-100 via-white to-fuchsia-50 text-gray-900">
      <div className="relative z-10 w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Flash Cards</h1>
        <p className="text-gray-600 text-center mb-6">
          Tap the card to hear and see the next
        </p>

        <div className="flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.button
              key={item.label}
              onClick={onClick}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-72 h-96 rounded-3xl bg-white border border-fuchsia-200 shadow hover:shadow-md active:scale-[0.99] grid grid-rows-[1fr_auto] place-items-center p-6"
              aria-label={`Flash card ${item.label}`}
            >
              <div className="flex items-center justify-center">
                <Icon
                  icon={item.icon}
                  width={160}
                  height={160}
                  className="text-fuchsia-600"
                />
              </div>
              <div className="text-3xl font-extrabold text-fuchsia-700 select-none">
                {item.label}
              </div>
            </motion.button>
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => speakText(item.label)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-fuchsia-600 text-white font-semibold hover:bg-fuchsia-700 active:scale-95"
          >
            Say it again
          </button>
        </div>
      </div>
    </div>
  );
}
