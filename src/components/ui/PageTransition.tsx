import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
}

export default function PageTransition({ children }: PageTransitionProps) {
  const variants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
