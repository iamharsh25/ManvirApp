import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  addNewCategory,
  addNewFlashCard,
  updateExistingFlashCard,
  getFlashCardForEdit,
  getAvailableCategories,
} from "../../utils/imageLoader";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = "admin";

export default function AdminModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminModalProps) {
  const [step, setStep] = useState<"password" | "upload" | "edit">("password");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setStep("upload");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleClose = () => {
    setStep("password");
    setPassword("");
    setError("");
    onClose();
  };

  const handleEditMode = () => {
    setStep("edit");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {step === "password"
                ? "Admin Access"
                : step === "edit"
                ? "Edit Flash Card"
                : "Add New Content"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "password" ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Admin Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Access Admin Panel
                </button>
              </form>
            ) : step === "edit" ? (
              <EditFlashCardForm onSuccess={onSuccess} onClose={handleClose} />
            ) : (
              <AdminUploadForm
                onSuccess={onSuccess}
                onClose={handleClose}
                onEditMode={handleEditMode}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Admin Upload Form Component
function AdminUploadForm({
  onSuccess,
  onClose,
  onEditMode,
}: {
  onSuccess: () => void;
  onClose: () => void;
  onEditMode: () => void;
}) {
  const [formData, setFormData] = useState({
    type: "category" as "category" | "flashcard",
    categoryName: "",
    flashcardName: "",
    existingCategory: "",
    image: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load available categories when component mounts
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getAvailableCategories();
        setAvailableCategories(categories.map((cat) => cat.folder));
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const resetForm = () => {
    setFormData({
      type: "flashcard",
      categoryName: "",
      flashcardName: "",
      existingCategory: "",
      image: null,
    });
    setMessage("");
    setShowSuccess(false);
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setMessage("Please select an image");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      if (formData.type === "category") {
        const success = await addNewCategory({
          name: formData.categoryName.toLowerCase().replace(/\s+/g, ""),
          displayName: formData.categoryName,
          description: `Learn about ${formData.categoryName.toLowerCase()}`,
          icon: "📁",
          color: "from-purple-500 to-pink-600",
          folder: formData.categoryName,
        });

        if (success) {
          setMessage(
            `Category "${formData.categoryName}" created successfully!`
          );
        } else {
          setMessage("Failed to create category. Please try again.");
        }
      } else {
        // Generate the expected filename for preview
        const fileExt =
          formData.image.name.split(".").pop()?.toLowerCase() || "png";
        const cleanName = formData.flashcardName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, "_")
          .trim();
        const expectedFileName = `${cleanName}.${fileExt}`;

        const success = await addNewFlashCard({
          name: formData.flashcardName,
          category: formData.existingCategory,
          image: formData.image,
        });

        if (success) {
          setMessage(
            `✅ Flash card "${formData.flashcardName}" added successfully!\nFile saved as: ${expectedFileName}`
          );
          setShowSuccess(true);
        } else {
          setMessage(
            "❌ Failed to add flash card. Please check:\n- Category exists\n- Image is valid\n- Try again"
          );
          setShowSuccess(false);
        }
      }

      // Don't auto-close, let user decide
      setTimeout(() => {
        onSuccess(); // Refresh the categories/flash cards
        // Don't call onClose() - let user decide when to close
      }, 1000);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What would you like to add?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: "category" }))
            }
            className={`p-3 rounded-lg border-2 transition-colors ${
              formData.type === "category"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">📁</div>
            <div className="text-sm font-medium">New Category</div>
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: "flashcard" }))
            }
            className={`p-3 rounded-lg border-2 transition-colors ${
              formData.type === "flashcard"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">🃏</div>
            <div className="text-sm font-medium">New Flash Card</div>
          </button>
        </div>
      </div>

      {/* Category Name (for new category) */}
      {formData.type === "category" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={formData.categoryName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, categoryName: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Animals, Colors, Shapes"
            required
          />
        </div>
      )}

      {/* Existing Category (for flash card) */}
      {formData.type === "flashcard" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category
          </label>
          <select
            value={formData.existingCategory}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                existingCategory: e.target.value,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a category</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Flash Card Name (for flash card) */}
      {formData.type === "flashcard" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flash Card Name
          </label>
          <input
            type="text"
            value={formData.flashcardName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                flashcardName: e.target.value,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., BMW, Happy, Sunny"
            required
          />
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {formData.image && (
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <div>Selected: {formData.image.name}</div>
            {formData.type === "flashcard" && formData.flashcardName && (
              <div className="text-blue-600 font-medium">
                Will be saved as:{" "}
                {formData.flashcardName
                  .toLowerCase()
                  .replace(/[^a-z0-9\s]/g, "")
                  .replace(/\s+/g, "_")
                  .trim()}
                .{formData.image.name.split(".").pop()?.toLowerCase() || "png"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("successfully")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload & Save"}
        </button>

        {/* Edit Mode Button */}
        <button
          type="button"
          onClick={onEditMode}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Edit Existing Flash Card
        </button>

        {/* Success Actions */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Another
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </div>
    </form>
  );
}

// Edit Flash Card Form Component
function EditFlashCardForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    searchName: "",
    searchCategory: "",
    newName: "",
    newCategory: "",
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [foundCard, setFoundCard] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load available categories when component mounts
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getAvailableCategories();
        setAvailableCategories(categories.map((cat) => cat.folder));
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.searchName || !formData.searchCategory) {
      setMessage("Please enter both name and category to search");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const card = await getFlashCardForEdit(
        formData.searchName,
        formData.searchCategory
      );
      if (card) {
        setFoundCard(card);
        setFormData((prev) => ({
          ...prev,
          newName: card.name,
          newCategory: formData.searchCategory,
        }));
        setMessage("✅ Flash card found! You can now edit it below.");
      } else {
        setMessage(
          "❌ Flash card not found. Please check the name and category."
        );
        setFoundCard(null);
      }
    } catch (error) {
      setMessage("Error searching for flash card. Please try again.");
      setFoundCard(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundCard) {
      setMessage("Please search for a flash card first");
      return;
    }

    setIsUpdating(true);
    setMessage("");

    try {
      const success = await updateExistingFlashCard({
        id: parseInt(foundCard.id),
        name: formData.newName,
        category: formData.newCategory,
        image: formData.image || undefined,
      });

      if (success) {
        setMessage(`✅ Flash card "${formData.newName}" updated successfully!`);
        setShowSuccess(true);
      } else {
        setMessage("❌ Failed to update flash card. Please try again.");
        setShowSuccess(false);
      }
    } catch (error) {
      setMessage("Update failed. Please try again.");
      setShowSuccess(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      searchName: "",
      searchCategory: "",
      newName: "",
      newCategory: "",
      image: null,
    });
    setMessage("");
    setShowSuccess(false);
    setFoundCard(null);
    setIsLoading(false);
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Find Flash Card to Edit
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flash Card Name
            </label>
            <input
              type="text"
              value={formData.searchName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, searchName: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., BMW"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.searchCategory}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  searchCategory: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Find Flash Card"}
        </button>
      </form>

      {/* Edit Form - Only show if card found */}
      {foundCard && (
        <form onSubmit={handleUpdate} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Edit Flash Card
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Name
              </label>
              <input
                type="text"
                value={formData.newName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newName: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., BMW"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Category
              </label>
              <select
                value={formData.newCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newCategory: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a category</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.image && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {formData.image.name}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Flash Card"}
          </button>
        </form>
      )}

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("successfully") || message.includes("found")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
        {showSuccess && (
          <button
            type="button"
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
