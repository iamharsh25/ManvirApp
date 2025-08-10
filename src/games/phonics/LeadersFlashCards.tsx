import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadVoices, speakText } from "../curiousmanvir/voice";
import { leaders } from "../../content/leaders";

function makeDeck(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i).sort(
    () => Math.random() - 0.5
  );
}

function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const trimmed = path.replace(/^\//, "");
  return base + trimmed;
}

export default function LeadersFlashCards() {
  const [deck, setDeck] = useState<number[]>(() => makeDeck(leaders.length));
  const [pos, setPos] = useState<number>(0);

  useEffect(() => {
    loadVoices();
  }, []);

  const currentIndex = deck[pos] ?? 0;
  const item = useMemo(() => leaders[currentIndex], [currentIndex]);

  const next = useCallback(() => {
    setPos((p) => {
      const np = p + 1;
      if (np >= deck.length) {
        setDeck(makeDeck(leaders.length));
        return 0;
      }
      return np;
    });
  }, [deck.length]);

  const onClick = useCallback(() => {
    speakText(item.name);
    next();
  }, [item, next]);

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-emerald-100 via-white to-emerald-50 text-gray-900">
      <div className="relative z-10 w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Leaders Flash Cards
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Tap the card to hear the name and see the next
        </p>

        <div className="flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.button
              key={item.id}
              onClick={onClick}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-72 h-96 rounded-3xl bg-white border border-emerald-200 shadow hover:shadow-md active:scale-[0.99] grid grid-rows-[1fr_auto] place-items-center p-6"
              aria-label={`Flash card ${item.name}`}
            >
              <div className="flex items-center justify-center">
                <img
                  src={publicUrl(item.img)}
                  alt={item.name}
                  className="w-56 h-56 object-contain"
                />
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 select-none text-center">
                {item.name}
              </div>
            </motion.button>
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => speakText(item.name)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 active:scale-95"
          >
            Say it again
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Images live in public/images/leaders/. Filenames with spaces are
          supported.
        </div>
      </div>
    </div>
  );
}
