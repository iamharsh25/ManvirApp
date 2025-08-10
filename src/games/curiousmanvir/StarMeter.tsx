import { memo } from "react";
import { motion } from "framer-motion";

interface StarMeterProps {
  total?: number;
  earned: number;
}

export default memo(function StarMeter({ total = 5, earned }: StarMeterProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 select-none"
      aria-label={`Stars ${earned} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < earned;
        return (
          <motion.span
            key={i}
            aria-hidden
            initial={false}
            animate={{
              scale: filled ? 1.1 : 1,
              rotate: filled ? [0, -10, 10, -5, 5, 0] : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={filled ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </motion.span>
        );
      })}
    </div>
  );
});
