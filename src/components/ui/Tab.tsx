import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface TabProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: string;
  className?: string;
}

export default function Tab({
  children,
  isActive,
  onClick,
  icon,
  className = "",
}: TabProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-200
        ${
          isActive
            ? "bg-white text-gray-800 shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
        }
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && (
        <img src={icon} alt="Tab icon" className="w-8 h-8 object-contain" />
      )}
      <span>{children}</span>
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
