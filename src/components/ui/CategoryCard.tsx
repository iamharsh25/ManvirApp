import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode | string;
  onClick: () => void;
  color: string;
  delay?: number;
}

export default function CategoryCard({
  title,
  subtitle,
  icon,
  onClick,
  color,
  delay = 0,
}: CategoryCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-center">
        <motion.div
          className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
          whileHover={{ rotate: 5 }}
        >
          {typeof icon === "string" && icon.includes(".png") ? (
            <div className="relative w-16 h-16">
              <img
                src={icon}
                alt={title}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  console.error("Image failed to load:", icon);
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
                onLoad={() => {
                  console.log("Image loaded successfully:", icon);
                }}
              />
              <div className="hidden text-4xl">📚</div>
            </div>
          ) : (
            icon
          )}
        </motion.div>

        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-gray-900">
          {title}
        </h3>

        <p className="text-sm text-gray-500 group-hover:text-gray-600">
          {subtitle}
        </p>
      </div>
    </motion.button>
  );
}
