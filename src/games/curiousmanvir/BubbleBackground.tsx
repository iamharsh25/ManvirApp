import { memo, useMemo } from "react";
import { motion } from "framer-motion";

export default memo(function BubbleBackground() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const size = 30 + Math.floor(Math.random() * 60);
        const left = Math.random() * 100; // vw
        const delay = Math.random() * 4; // s
        const duration = 8 + Math.random() * 6; // s
        const opacity = 0.08 + Math.random() * 0.08;
        return { id: i, size, left, delay, duration, opacity };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b) => (
        <motion.span
          key={b.id}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "-20%", opacity: b.opacity }}
          transition={{
            repeat: Infinity,
            delay: b.delay,
            duration: b.duration,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${b.left}vw`,
            bottom: -b.size,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(255,255,255,0))",
            boxShadow: "0 0 24px rgba(59,130,246,0.25)",
          }}
        />
      ))}
    </div>
  );
});
