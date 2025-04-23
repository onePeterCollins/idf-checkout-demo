import { Category } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { MoreVertical, Edit, Trash, Package, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

interface CategoryListProps {
  categories?: Category[];
  onEdit: (category: Category) => void;
  isLoading: boolean;
  error: Error | null;
}

export default function CategoryList({ categories, onEdit, isLoading, error }: CategoryListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  
  // Fetch product counts for each category
  const { data: productCounts } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/dashboard'] });
      setDeleteCategoryId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete category",
        description: error.message,
        variant: "destructive",
      });
      setDeleteCategoryId(null);
    },
  });

  const handleDelete = (id: number) => {
    setDeleteCategoryId(id);
  };

  const confirmDelete = () => {
    if (deleteCategoryId) {
      deleteCategoryMutation.mutate(deleteCategoryId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-center">
                <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center text-red-500 p-4">
            <p className="font-semibold">Error loading categories</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categories?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">You haven't added any categories yet.</p>
            <Button onClick={() => window.document.getElementById('add-category-button')?.click()}>
              Add Your First Category
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCategoryProductCount = (categoryId: number) => {
    if (!productCounts?.productCountsByCategory) return 0;
    const categoryData = productCounts.productCountsByCategory.find(c => c.categoryId === categoryId);
    return categoryData?.count || 0;
  };

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const productCount = getCategoryProductCount(category.id);
              
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 truncate max-w-[300px]">
                    {category.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={productCount > 0 ? "success" : "secondary"}>
                      {productCount} {productCount === 1 ? 'product' : 'products'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onEdit(category)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {category.imageUrl && (
                          <DropdownMenuItem
                            onClick={() => window.open(category.imageUrl, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> View Image
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 focus:text-red-500"
                          disabled={productCount > 0}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteCategoryId !== null} onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
