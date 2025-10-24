"use client";

import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Circle, Plus } from "lucide-react";
import CreateCategoryModal from "./CreateCategoryModal";

// CategoryItem component
const CategoryItem = ({ color, name, count, isSelected, onClick }) => (
  <div
    className={`flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-colors duration-200 ${
      isSelected ? "font-bold" : "hover:font-bold"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-2">
      <Circle className="w-4 h-4" fill={color} strokeWidth={0} />
      <span>{name}</span>
    </div>
    <span>{count}</span>
  </div>
);

// CategorySidebar component
const CategorySidebar = ({
  categories,
  loading,
  onSelectCategory,
  selectedCategory,
  onCategoryCreated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler for category selection
  const handleCategorySelect = (categoryId) => {
    onSelectCategory(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <>
      <aside className="w-72 bg-[#faf1e4] p-6 hidden md:block shrink-0">
        <div className="category-sidebar">
          <h2
            className="font-bold mb-4 cursor-pointer"
            onClick={() => handleCategorySelect(null)}
          >
            All Categories
          </h2>
          {loading ? (
            <Skeleton className="h-6 mb-4" />
          ) : categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  color={category.color}
                  name={category.name}
                  count={category.note_count}
                  isSelected={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No categories available.</p>
          )}

          {/* Create New Category Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 py-2 px-3 mt-4 w-full text-left rounded-md cursor-pointer transition-colors duration-200 hover:font-bold text-[#95715e]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>
      </aside>

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryCreated={onCategoryCreated}
      />
    </>
  );
};

export default CategorySidebar;
