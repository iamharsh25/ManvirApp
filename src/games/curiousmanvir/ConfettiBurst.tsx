import { memo, useMemo } from "react";
import { motion } from "framer-motion";

interface ConfettiBurstProps {
  isActive: boolean;
  particleCount?: number;
  durationMs?: number;
}

const COLORS = [
  "#F43F5E",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#22D3EE",
];

export default memo(function ConfettiBurst({
  isActive,
  particleCount = 40,
  durationMs = 1200,
}: ConfettiBurstProps) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, idx) => {
      const color = COLORS[idx % COLORS.length];
      const xSpread = (Math.random() - 0.5) * 300; // px
      const rotate = (Math.random() - 0.5) * 180; // deg
      const size = 6 + Math.floor(Math.random() * 8); // px
      const delay = Math.random() * 0.1; // s
      return { id: idx, color, xSpread, rotate, size, delay };
    });
  }, [particleCount]);

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center">
      <div className="relative top-24 h-0 w-full">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [1, 0.9, 0.7, 0],
              y: [0, 140, 260, 380],
              x: [0, p.xSpread * 0.5, p.xSpread],
              rotate: [0, p.rotate * 0.6, p.rotate],
            }}
            transition={{
              duration: durationMs / 1000,
              ease: "easeOut",
              delay: p.delay,
            }}
            style={{
              display: "inline-block",
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              marginLeft: 4,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </div>
  );
});
