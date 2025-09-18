import { motion } from "framer-motion";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export default function BackButton({
  onClick,
  label = "Back",
}: BackButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-6 h-6 flex items-center justify-center"
        whileHover={{ x: -2 }}
      >
        ←
      </motion.div>
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}
