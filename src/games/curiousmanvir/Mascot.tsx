import { memo } from "react";
import { motion } from "framer-motion";

interface MascotProps {
  mood: "idle" | "happy" | "oops";
}

export default memo(function Mascot({ mood }: MascotProps) {
  const face = mood === "happy" ? "😄" : mood === "oops" ? "😯" : "🙂";
  const color =
    mood === "happy"
      ? "bg-green-100"
      : mood === "oops"
      ? "bg-red-100"
      : "bg-blue-100";
  const ring =
    mood === "happy"
      ? "ring-green-300"
      : mood === "oops"
      ? "ring-red-300"
      : "ring-blue-300";

  return (
    <motion.div
      initial={false}
      animate={{
        scale: mood === "happy" ? [1, 1.1, 1] : 1,
        rotate: mood === "oops" ? [0, -8, 8, -5, 5, 0] : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`mx-auto w-20 h-20 ${color} rounded-full grid place-items-center ring-4 ${ring}`}
      aria-label="friendly mascot"
    >
      <span className="text-3xl" aria-hidden>
        {face}
      </span>
    </motion.div>
  );
});
