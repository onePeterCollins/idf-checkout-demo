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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Return, 
  Order,
  OrderItem
} from "@shared/schema";
import { 
  Alert,
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface ReturnFormProps {
  returnItem: Return | null;
  orders: Order[];
  onSuccess: () => void;
  onCancel: () => void;
}

const returnFormSchema = z.object({
  orderId: z.coerce.number().min(1, {
    message: "Please select an order.",
  }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }),
  status: z.enum(["pending", "approved", "rejected", "completed"]).default("pending"),
  refundAmount: z.coerce.number().min(0).optional(),
  requestedItems: z.string().transform(val => JSON.parse(val))
});

export default function ReturnForm({ returnItem, orders, onSuccess, onCancel }: ReturnFormProps) {
  const { toast } = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState<number>(returnItem?.orderId || 0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Only fetch order items if an order is selected
  const { data: orderDetails } = useQuery({
    queryKey: [`/api/orders/${selectedOrderId}`],
    enabled: selectedOrderId > 0,
  });

  // Parse the requestedItems JSON when editing a return
  useEffect(() => {
    if (returnItem && returnItem.requestedItems) {
      try {
        const items = JSON.parse(returnItem.requestedItems as string);
        setSelectedItems(Array.isArray(items) ? items : []);
      } catch (e) {
        console.error("Error parsing requestedItems:", e);
        setSelectedItems([]);
      }
    }
  }, [returnItem]);

  const form = useForm<z.infer<typeof returnFormSchema>>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      orderId: returnItem?.orderId || 0,
      reason: returnItem?.reason || "",
      status: returnItem?.status as "pending" | "approved" | "rejected" | "completed" || "pending",
      refundAmount: returnItem?.refundAmount || 0,
      requestedItems: returnItem?.requestedItems as string || "[]"
    },
  });

  // Update the form when order changes
  useEffect(() => {
    if (selectedOrderId) {
      form.setValue("orderId", selectedOrderId);
    }
  }, [selectedOrderId, form]);

  // Update the form when selected items change
  useEffect(() => {
    form.setValue("requestedItems", JSON.stringify(selectedItems));
  }, [selectedItems, form]);

  const createReturnMutation = useMutation({
    mutationFn: async (data: z.infer<typeof returnFormSchema>) => {
      const isUpdate = returnItem !== null;
      const url = isUpdate ? `/api/returns/${returnItem.id}` : "/api/returns";
      const method = isUpdate ? "PATCH" : "POST";
      
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `Return request ${returnItem ? "updated" : "created"} successfully`,
        variant: "success",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${returnItem ? "update" : "create"} return request`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof returnFormSchema>) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to return.",
        variant: "destructive",
      });
      return;
    }
    
    createReturnMutation.mutate(data);
  };

  // Handle checkbox changes for item selection
  const handleItemSelection = (itemId: number, checked: boolean) => {
    setSelectedItems(prev => {
      if (checked) {
        return [...prev, itemId];
      } else {
        return prev.filter(id => id !== itemId);
      }
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate total refund amount based on selected items
  const calculateRefundAmount = () => {
    if (!orderDetails?.items) return 0;
    
    return orderDetails.items
      .filter((item: OrderItem) => selectedItems.includes(item.id))
      .reduce((sum: number, item: OrderItem) => sum + item.total, 0);
  };

  // Update refund amount when items are selected/deselected
  useEffect(() => {
    if (selectedItems.length > 0) {
      form.setValue("refundAmount", calculateRefundAmount());
    }
  }, [selectedItems, orderDetails]);

  // Get sorted orders (newest first)
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Disable form if viewing a non-pending return
  const isReadOnly = returnItem && returnItem.status !== "pending";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isReadOnly && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Read-only mode</AlertTitle>
            <AlertDescription>
              This return request cannot be modified because it has already been {returnItem.status}.
            </AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Order</FormLabel>
              <Select
                disabled={!!returnItem || isReadOnly} // Disable if editing an existing return
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedOrderId(Number(value));
                  setSelectedItems([]);
                }}
                defaultValue={field.value.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortedOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id.toString()}>
                      #{order.id} - {order.customerName} ({formatCurrency(order.total)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {orderDetails?.items && (
          <div className="border p-4 rounded-md">
            <FormLabel className="block mb-2">Select Items to Return</FormLabel>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2">
              {orderDetails.items.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => 
                      handleItemSelection(item.id, checked as boolean)
                    }
                    disabled={isReadOnly}
                  />
                  <label
                    htmlFor={`item-${item.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                  >
                    {item.productName} ({item.quantity} x {formatCurrency(item.price)})
                  </label>
                  <span className="text-sm">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Reason</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please explain the reason for your return request" 
                  className="resize-none" 
                  rows={3}
                  {...field}
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {returnItem && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="refundAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refund Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  disabled={!returnItem || isReadOnly}
                  value={calculateRefundAmount()}
                />
              </FormControl>
              <FormDescription>
                {returnItem 
                  ? "Amount to be refunded to the customer" 
                  : "Amount will be calculated based on selected items"}
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
          {!isReadOnly && (
            <Button 
              type="submit"
              disabled={createReturnMutation.isPending}
            >
              {createReturnMutation.isPending 
                ? 'Saving...' 
                : (returnItem ? 'Update Return' : 'Submit Return Request')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
