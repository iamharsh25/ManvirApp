import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlphabetGame } from "./games/curiousmanvir";
import {
  PhonicsPlayground,
  FlashCards,
  LeadersFlashCards,
} from "./games/phonics";

export default function MiniPlayground() {
  const tabs = useMemo(
    () => [
      { key: "alphabets", label: "Alphabets", element: <AlphabetGame /> },
      { key: "phonics", label: "Phonics", element: <PhonicsPlayground /> },
      { key: "flash", label: "Flash Cards", element: <FlashCards /> },
      { key: "leaders", label: "Leaders", element: <LeadersFlashCards /> },
      { key: "more", label: "More", element: <ComingSoon /> },
    ],
    []
  );

  const [activeKey, setActiveKey] = useState<string>(tabs[0].key);
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-gray-900">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-2xl px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {tabs.map((t) => {
              const isActive = t.key === activeKey;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveKey(t.key)}
                  className="relative px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100 whitespace-nowrap"
                >
                  <span
                    className={isActive ? "text-gray-900" : "text-gray-500"}
                  >
                    {t.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute left-2 right-2 -bottom-0.5 h-0.5 bg-gray-900 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1">{active.element}</div>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-semibold mb-2">More mini games soon</div>
        <p className="text-gray-500">
          Try Alphabets, Phonics, Flash Cards, or Leaders.
        </p>
      </div>
    </div>
  );
}
