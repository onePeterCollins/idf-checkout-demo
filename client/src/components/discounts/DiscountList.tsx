import { Discount } from "@shared/schema";
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
import { useState } from "react";
import { MoreVertical, Edit, Trash, Percent, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface DiscountListProps {
  discounts?: Discount[];
  onEdit: (discount: Discount) => void;
  isLoading: boolean;
  error: Error | null;
}

export default function DiscountList({ discounts, onEdit, isLoading, error }: DiscountListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDiscountId, setDeleteDiscountId] = useState<number | null>(null);

  const deleteDiscountMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/discounts/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Discount deleted",
        description: "The discount has been deleted successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/discounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/discounts/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/dashboard'] });
      setDeleteDiscountId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete discount",
        description: error.message,
        variant: "destructive",
      });
      setDeleteDiscountId(null);
    },
  });

  const handleDelete = (id: number) => {
    setDeleteDiscountId(id);
  };

  const confirmDelete = () => {
    if (deleteDiscountId) {
      deleteDiscountMutation.mutate(deleteDiscountId);
    }
  };

  const getDiscountValue = (discount: Discount): string => {
    return discount.type === "percentage"
      ? `${discount.value}%`
      : formatCurrency(discount.value);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDateRange = (discount: Discount): string => {
    if (!discount.startDate && !discount.endDate) return "Always active";
    
    let dateString = "";
    
    if (discount.startDate) {
      const startDate = new Date(discount.startDate);
      dateString += `From ${format(startDate, "MMM d, yyyy")}`;
    }
    
    if (discount.endDate) {
      const endDate = new Date(discount.endDate);
      dateString += `${discount.startDate ? " to " : "Until "}${format(endDate, "MMM d, yyyy")}`;
    } else if (discount.startDate) {
      dateString += " onwards";
    }
    
    return dateString;
  };

  const getStatusBadge = (discount: Discount) => {
    const now = new Date();
    
    if (!discount.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    if (discount.startDate && new Date(discount.startDate) > now) {
      return <Badge variant="warning">Scheduled</Badge>;
    }
    
    if (discount.endDate && new Date(discount.endDate) < now) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    
    return <Badge variant="success">Active</Badge>;
  };

  const getScopeName = (discount: Discount): string => {
    switch (discount.scope) {
      case "all":
        return "All Products";
      case "category":
        return "Category";
      case "product":
        return "Product";
      case "tag":
        return "Tag";
      default:
        return discount.scope;
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
            <p className="font-semibold">Error loading discounts</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!discounts?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">No discounts found</h3>
            <p className="text-gray-500 mb-4">You haven't created any discounts yet.</p>
            <Button onClick={() => window.document.getElementById('create-discount-button')?.click()}>
              Create Your First Discount
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
              <TableHead>Discount</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{discount.name}</div>
                    {discount.description && (
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {discount.description}
                      </div>
                    )}
                    {discount.code && (
                      <div className="mt-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {discount.code}
                        </Badge>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {discount.type === "percentage" ? (
                      <Percent className="h-4 w-4 mr-1 text-primary" />
                    ) : (
                      <DollarSign className="h-4 w-4 mr-1 text-primary" />
                    )}
                    <span>{getDiscountValue(discount)}</span>
                  </div>
                </TableCell>
                <TableCell>{getScopeName(discount)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{formatDateRange(discount)}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(discount)}</TableCell>
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
                        onClick={() => onEdit(discount)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(discount.id)}
                        className="text-red-600 focus:text-red-500"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDiscountId !== null} onOpenChange={(open) => !open && setDeleteDiscountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the discount. This action cannot be undone.
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
