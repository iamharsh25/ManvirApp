import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getAvailableCategories,
  type DynamicCategory,
} from "../../utils/imageLoader";
import AdminModal from "../admin/AdminModal";

interface CategorySelectionProps {
  onCategorySelect: (category: DynamicCategory) => void;
}

export default function CategorySelection({
  onCategorySelect,
}: CategorySelectionProps) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [categories, setCategories] = useState<DynamicCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const availableCategories = await getAvailableCategories();
      setCategories(availableCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSuccess = () => {
    // Refresh categories after admin action
    loadCategories();
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Choose a Category
          </h2>
          <p className="text-lg text-gray-600">
            Select a category to start learning with flash cards
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adding some categories from the admin panel.
            </p>
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Add Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <motion.button
                  onClick={() => onCategorySelect(category)}
                  className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {category.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                    {category.displayName}
                  </h3>

                  <p className="text-gray-600 text-sm group-hover:text-gray-700">
                    {category.description}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {category.imageCount} cards available
                  </p>

                  <motion.div
                    className="mt-4 text-blue-600 font-semibold text-sm"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    Click to start →
                  </motion.div>
                </motion.button>
              </motion.div>
            ))}

            {/* Admin Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: categories.length * 0.1,
              }}
              className="group"
            >
              <motion.button
                onClick={() => setShowAdminModal(true)}
                className="w-full p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-300 group-hover:border-gray-400"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-3xl shadow-lg">
                  ➕
                </div>

                <h3 className="text-xl font-bold text-gray-700 mb-2 group-hover:text-gray-800">
                  Add More Categories
                </h3>

                <p className="text-gray-500 text-sm group-hover:text-gray-600">
                  Add new flash card categories
                </p>

                <motion.div
                  className="mt-4 text-gray-600 font-semibold text-sm"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  Admin Access →
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}
