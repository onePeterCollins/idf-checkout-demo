import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import DiscountList from "@/components/discounts/DiscountList";
import DiscountForm from "@/components/discounts/DiscountForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Discount } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Discounts() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const queryClient = useQueryClient();

  const { data: discounts, isLoading, error } = useQuery({
    queryKey: ['/api/discounts'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: tags } = useQuery({
    queryKey: ['/api/tags'],
  });

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDiscount(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/discounts'] });
    queryClient.invalidateQueries({ queryKey: ['/api/discounts/active'] });
    queryClient.invalidateQueries({ queryKey: ['/api/analytics/dashboard'] });
    setIsFormOpen(false);
    setEditingDiscount(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Discounts & Promotions</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Discount
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Discounts</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <DiscountList 
            discounts={discounts} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="active">
          <DiscountList 
            discounts={discounts?.filter(d => d.isActive && (!d.endDate || new Date(d.endDate) > new Date()) && (!d.startDate || new Date(d.startDate) <= new Date()))} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="scheduled">
          <DiscountList 
            discounts={discounts?.filter(d => d.isActive && d.startDate && new Date(d.startDate) > new Date())} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="expired">
          <DiscountList 
            discounts={discounts?.filter(d => !d.isActive || (d.endDate && new Date(d.endDate) <= new Date()))} 
            onEdit={handleEdit} 
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingDiscount ? 'Edit Discount' : 'Create New Discount'}</SheetTitle>
            <SheetDescription>
              {editingDiscount ? 'Update discount information' : 'Set up a new discount or promotion for your products'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <DiscountForm 
              discount={editingDiscount}
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
