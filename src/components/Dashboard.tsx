import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryCard from "./ui/CategoryCard";
import PageTransition from "./ui/PageTransition";
import BackButton from "./ui/BackButton";
import FlashCardGame from "./games/FlashCardGame";
import { DAILY_NAME } from "../config/nameConfig";

type PageType = "dashboard" | "flashcard";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [pageDirection, setPageDirection] = useState<"left" | "right">("left");

  const categories = [
    {
      id: "flashcard",
      title: "Flash Cards",
      subtitle: "Learn with images",
      icon: "/GameIcons/FlashCard.png",
      color: "bg-gradient-to-br from-blue-500 to-purple-600",
      onClick: () => {
        setPageDirection("left");
        setCurrentPage("flashcard");
      },
    },
  ];

  const handleBack = () => {
    setPageDirection("right");
    setCurrentPage("dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <motion.header
        className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {DAILY_NAME}'s Learning Hub
              </h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Session Active</div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentPage === "dashboard" ? (
            <PageTransition key="dashboard" direction={pageDirection}>
              {/* Welcome Section */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, {DAILY_NAME}!
                </h2>
                <p className="text-lg text-gray-600">
                  Choose a category to start learning and having fun
                </p>
              </motion.div>

              {/* Category Grid */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="w-full max-w-sm">
                  {categories.map((category, index) => (
                    <CategoryCard
                      key={category.id}
                      title={category.title}
                      subtitle={category.subtitle}
                      icon={category.icon}
                      color={category.color}
                      onClick={category.onClick}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </motion.div>
            </PageTransition>
          ) : (
            <PageTransition key="flashcard" direction={pageDirection}>
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Back Button */}
                <div className="p-6 border-b border-gray-200">
                  <BackButton onClick={handleBack} label="Back to Categories" />
                </div>

                {/* Flash Card Game */}
                <FlashCardGame />
              </div>
            </PageTransition>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
