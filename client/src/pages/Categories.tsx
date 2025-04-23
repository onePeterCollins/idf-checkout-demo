import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import CategoryList from "@/components/categories/CategoryList";
import CategoryForm from "@/components/categories/CategoryForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Category } from "@shared/schema";

export default function Categories() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    queryClient.invalidateQueries({ queryKey: ['/api/analytics/dashboard'] });
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Product Categories</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <CategoryList 
        categories={categories} 
        onEdit={handleEdit} 
        isLoading={isLoading}
        error={error}
      />

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</SheetTitle>
            <SheetDescription>
              {editingCategory ? 'Update category information' : 'Enter category details to help organize your products'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <CategoryForm 
              category={editingCategory}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
