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
import { Category } from "@shared/schema";

interface CategoryFormProps {
  category: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  imageUrl: z.string().url({
    message: "Please enter a valid URL for the image.",
  }).optional().or(z.literal('')),
  userId: z.coerce.number().int().default(1), // For demo purposes, using fixed userId
});

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      imageUrl: category?.imageUrl || "",
      userId: 1, // For demo purposes
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof categoryFormSchema>) => {
      const isUpdate = category !== null;
      const url = isUpdate ? `/api/categories/${category.id}` : "/api/categories";
      const method = isUpdate ? "PATCH" : "POST";
      
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `Category ${category ? "updated" : "created"} successfully`,
        variant: "success",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${category ? "update" : "create"} category`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof categoryFormSchema>) => {
    createCategoryMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
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
                  placeholder="Describe your category" 
                  className="resize-none" 
                  rows={3}
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Optional description to help identify the category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Provide a URL to an image representing the category
              </FormDescription>
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
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending ? 'Saving...' : (category ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
