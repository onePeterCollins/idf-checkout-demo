import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, Category, Tag } from "@shared/schema";

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  tags: Tag[];
  onSuccess: () => void;
  onCancel: () => void;
}

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  cost: z.coerce.number().min(0, {
    message: "Cost must be at least 0.",
  }),
  stock: z.coerce.number().int().min(0, {
    message: "Stock must be a non-negative number.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL for the image.",
  }).optional().or(z.literal('')),
  categoryId: z.coerce.number().int().optional().nullable(),
  selectedTags: z.array(z.coerce.number().int()).optional(),
  userId: z.coerce.number().int().default(1), // For demo purposes, using fixed userId
  source: z.string().default("manual"),
});

export default function ProductForm({ product, categories, tags, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();

  // Get product tags if editing a product
  const productTagIds = product?.tags?.map(tag => tag.id) || [];
  
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      cost: product?.cost || 0,
      stock: product?.stock || 0,
      imageUrl: product?.imageUrl || "",
      categoryId: product?.categoryId || null,
      selectedTags: productTagIds,
      userId: 1, // For demo purposes
      source: product?.source || "manual",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof productFormSchema>) => {
      // Extract selectedTags from the form data for separate processing
      const { selectedTags, ...productData } = data;
      
      // Create/update the product
      const isUpdate = product !== null;
      const url = isUpdate ? `/api/products/${product.id}` : "/api/products";
      const method = isUpdate ? "PATCH" : "POST";
      
      const response = await apiRequest(method, url, productData);
      const newProduct = await response.json();
      
      // If we have selected tags, add them to the product
      if (selectedTags && selectedTags.length > 0) {
        // If updating, first remove existing tags
        if (isUpdate) {
          // This is simplified - in a real app we'd want to compare existing vs new tags
          // and only remove/add as needed
          await Promise.all(productTagIds.map(tagId => 
            apiRequest("DELETE", `/api/products/${newProduct.id}/tags/${tagId}`, {})
          ));
        }
        
        // Add new tags
        await Promise.all(selectedTags.map(tagId => 
          apiRequest("POST", `/api/products/${newProduct.id}/tags`, { tagId })
        ));
      }
      
      return newProduct;
    },
    onSuccess: () => {
      toast({
        title: `Product ${product ? "updated" : "created"} successfully`,
        variant: "success",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${product ? "update" : "create"} product`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof productFormSchema>) => {
    createProductMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your product" 
                  className="resize-none" 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value?.toString() || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL to an image of the product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="selectedTags"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Tags</FormLabel>
                <FormDescription>
                  Select tags to help categorize and organize your product
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {tags.map((tag) => (
                  <FormField
                    key={tag.id}
                    control={form.control}
                    name="selectedTags"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tag.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tag.id)}
                              onCheckedChange={(checked) => {
                                const updatedTags = checked
                                  ? [...(field.value || []), tag.id]
                                  : field.value?.filter((id) => id !== tag.id) || [];
                                field.onChange(updatedTags);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {tag.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? 'Saving...' : (product ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
