import { Product } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
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
import { SocialIcon } from "@/components/ui/icons";
import { useState } from "react";
import { MoreVertical, Edit, Trash, Tag, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductListProps {
  products?: Product[];
  onEdit: (product: Product) => void;
  isLoading: boolean;
  error: Error | null;
}

export default function ProductList({ products, onEdit, isLoading, error }: ProductListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  
  // Fetch tags for each product
  const productTags = useQuery({
    queryKey: ['/api/tags'],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setDeleteProductId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
      setDeleteProductId(null);
    },
  });

  const handleDelete = (id: number) => {
    setDeleteProductId(id);
  };

  const confirmDelete = () => {
    if (deleteProductId) {
      deleteProductMutation.mutate(deleteProductId);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
            <p className="font-semibold">Error loading products</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">You haven't added any products yet.</p>
            <Button onClick={() => window.document.getElementById('add-product-button')?.click()}>
              Add Your First Product
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const profit = product.price - product.cost;
              const profitMargin = (profit / product.price) * 100;
              
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{formatCurrency(product.cost)}</TableCell>
                  <TableCell>
                    <div>
                      {formatCurrency(profit)}
                      <div className="text-xs">
                        <Badge variant={profitMargin > 30 ? "success" : profitMargin > 15 ? "warning" : "error"}>
                          {profitMargin.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
                    >
                      {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.source === 'manual' ? (
                      <Badge variant="default">Manual</Badge>
                    ) : (
                      <div className="flex items-center">
                        <SocialIcon platform={product.source as any} className="h-4 w-4 mr-1" />
                        <span className="text-sm capitalize">{product.source}</span>
                      </div>
                    )}
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
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(product.imageUrl, '_blank')}
                          disabled={!product.imageUrl}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" /> View Image
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 focus:text-red-500"
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

      <AlertDialog open={deleteProductId !== null} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product. This action cannot be undone.
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
