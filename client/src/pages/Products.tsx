import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import ProductList from "@/components/products/ProductList";
import ProductForm from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Product } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Products() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: tags } = useQuery({
    queryKey: ['/api/tags'],
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="manual">Manually Added</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ProductList 
            products={products} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="manual">
          <ProductList 
            products={products?.filter(p => p.source === 'manual')} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="facebook">
          <ProductList 
            products={products?.filter(p => p.source === 'facebook')} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="instagram">
          <ProductList 
            products={products?.filter(p => p.source === 'instagram')} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="whatsapp">
          <ProductList 
            products={products?.filter(p => p.source === 'whatsapp')} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="tiktok">
          <ProductList 
            products={products?.filter(p => p.source === 'tiktok')} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</SheetTitle>
            <SheetDescription>
              {editingProduct ? 'Update product information' : 'Enter product details to add to your store'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <ProductForm 
              product={editingProduct}
              categories={categories || []}
              tags={tags || []}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
