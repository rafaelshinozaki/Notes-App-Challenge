"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const AVAILABLE_COLORS = [
  "#e57373", // red
  "#f4a261", // orange
  "#e9c46a", // yellow
  "#a8dadc", // light blue
  "#81c784", // green
  "#ce93d8", // purple
];

const CreateCategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const { getToken } = useAuth();
  const { toast } = useToast();

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast({
        title: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryName.trim(),
            color: selectedColor,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Check if it's a duplicate name error
        if (errorData.name && errorData.name[0]) {
          throw new Error(errorData.name[0]);
        }
        throw new Error("Failed to create category");
      }

      const newCategory = await response.json();
      toast({
        title: "Category created successfully!",
      });

      // Reset form
      setCategoryName("");
      setSelectedColor(AVAILABLE_COLORS[0]);

      // Call callback with new category
      if (onCategoryCreated) {
        onCategoryCreated(newCategory);
      }

      // Close modal
      onClose();
    } catch (error) {
      toast({
        title: error.message || "Failed to create category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setCategoryName("");
      setSelectedColor(AVAILABLE_COLORS[0]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#faf8f3]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Create New Category
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={isCreating}
            className="border-[#95715e] focus:ring-[#95715e]"
            maxLength={100}
          />
          <div className="flex justify-center gap-3">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${
                  selectedColor === color
                    ? "scale-125 ring-2 ring-[#95715e] ring-offset-2"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                disabled={isCreating}
              />
            ))}
          </div>
          <Button
            onClick={handleCreateCategory}
            disabled={isCreating || !categoryName.trim()}
            className="w-full bg-[#95715e] hover:bg-[#7d5f4d] text-white"
          >
            {isCreating ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
