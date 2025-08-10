import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadVoices, speakLetter } from "../curiousmanvir/voice";

const PHONEMES = ["a", "b", "c", "s", "t", "m"] as const;

export default function PhonicsPlayground() {
  useEffect(() => {
    loadVoices();
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-amber-100 via-white to-amber-50 text-gray-900">
      <div className="relative z-10 w-full max-w-2xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Phonics Playground</h1>
        <p className="text-gray-600 mb-6">Tap a letter to hear its sound</p>

        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-4 place-items-center"
          >
            {PHONEMES.map((p) => (
              <button
                key={p}
                onClick={() => speakLetter(p)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-amber-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center text-5xl font-black text-amber-700"
                aria-label={`Phoneme ${p}`}
              >
                {p}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-sm text-gray-400">
          MVP set: a, b, c, s, t, m
        </div>
      </div>
    </div>
  );
}
