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
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Discount, Category, Tag } from "@shared/schema";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscountFormProps {
  discount: Discount | null;
  categories: Category[];
  tags: Tag[];
  onSuccess: () => void;
  onCancel: () => void;
}

const discountFormSchema = z.object({
  name: z.string().min(2, {
    message: "Discount name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(0, {
    message: "Value must be at least 0.",
  }),
  code: z.string().optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  isActive: z.boolean().default(true),
  scope: z.enum(["all", "category", "product", "tag"]),
  scopeId: z.coerce.number().int().optional().nullable(),
  userId: z.coerce.number().int().default(1), // For demo purposes, using fixed userId
});

export default function DiscountForm({ discount, categories, tags, onSuccess, onCancel }: DiscountFormProps) {
  const { toast } = useToast();
  const [scope, setScope] = useState<string>(discount?.scope || "all");
  
  const form = useForm<z.infer<typeof discountFormSchema>>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      name: discount?.name || "",
      description: discount?.description || "",
      type: discount?.type as "percentage" | "fixed" || "percentage",
      value: discount?.value || 0,
      code: discount?.code || "",
      startDate: discount?.startDate ? new Date(discount.startDate) : null,
      endDate: discount?.endDate ? new Date(discount.endDate) : null,
      isActive: discount?.isActive ?? true,
      scope: discount?.scope as "all" | "category" | "product" | "tag" || "all",
      scopeId: discount?.scopeId || null,
      userId: 1, // For demo purposes
    },
  });

  // Watch for scope changes to update the UI
  const watchScope = form.watch("scope");
  if (watchScope !== scope) {
    setScope(watchScope);
    // Reset scopeId when scope changes
    if (form.getValues("scopeId")) {
      form.setValue("scopeId", null);
    }
  }

  const createDiscountMutation = useMutation({
    mutationFn: async (data: z.infer<typeof discountFormSchema>) => {
      const isUpdate = discount !== null;
      const url = isUpdate ? `/api/discounts/${discount.id}` : "/api/discounts";
      const method = isUpdate ? "PATCH" : "POST";
      
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `Discount ${discount ? "updated" : "created"} successfully`,
        variant: "success",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${discount ? "update" : "create"} discount`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof discountFormSchema>) => {
    // If scope is 'all', ensure scopeId is null
    if (data.scope === "all") {
      data.scopeId = null;
    }
    
    createDiscountMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter discount name" {...field} />
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
                  placeholder="Describe your discount" 
                  className="resize-none" 
                  rows={2}
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Optional description of the discount for internal use
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Discount Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="percentage" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Percentage (%)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fixed" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Fixed Amount ($)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value {form.watch("type") === "percentage" ? "(%" : "($)"}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step={form.watch("type") === "percentage" ? "1" : "0.01"} 
                    min="0" 
                    max={form.watch("type") === "percentage" ? "100" : undefined}
                    placeholder={form.watch("type") === "percentage" ? "10" : "5.99"} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="SUMMER10" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Leave blank to apply discount automatically
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the discount becomes active
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate");
                        return startDate ? date < startDate : date < new Date("1900-01-01");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the discount expires
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Enable or disable this discount
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apply Discount To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount scope" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="category">Specific Category</SelectItem>
                  <SelectItem value="tag">Products with Tag</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {scope === "category" && (
          <FormField
            control={form.control}
            name="scopeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Category</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        )}
        
        {scope === "tag" && (
          <FormField
            control={form.control}
            name="scopeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Tag</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem 
                        key={tag.id} 
                        value={tag.id.toString()}
                      >
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
            disabled={createDiscountMutation.isPending}
          >
            {createDiscountMutation.isPending ? 'Saving...' : (discount ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
