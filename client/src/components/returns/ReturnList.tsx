import { Return } from "@shared/schema";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, Eye, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ReturnListProps {
  returns?: Return[];
  onViewDetails: (returnItem: Return) => void;
  isLoading: boolean;
  error: Error | null;
}

export default function ReturnList({ returns, onViewDetails, isLoading, error }: ReturnListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateReturnMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/returns/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Return status updated",
        description: "The return status has been updated successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/returns'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update return status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApproveReturn = (id: number) => {
    updateReturnMutation.mutate({ id, status: "approved" });
  };

  const handleRejectReturn = (id: number) => {
    updateReturnMutation.mutate({ id, status: "rejected" });
  };

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "approved":
        return <Badge variant="info">Approved</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "rejected":
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
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
            <p className="font-semibold">Error loading returns</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!returns?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <RefreshCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No return requests found</h3>
            <p className="text-gray-500 mb-4">There are no return requests matching your criteria.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Return ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Refund Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returns.map((returnItem) => (
            <TableRow key={returnItem.id}>
              <TableCell className="font-medium">#{returnItem.id}</TableCell>
              <TableCell>
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={() => window.open(`/orders/${returnItem.orderId}`, '_blank')}
                >
                  #{returnItem.orderId}
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-gray-500" />
                  <span className="text-sm">{formatDate(returnItem.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {returnItem.reason}
              </TableCell>
              <TableCell>
                {returnItem.refundAmount !== null && returnItem.refundAmount !== undefined ? (
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{formatCurrency(returnItem.refundAmount)}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Pending</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(returnItem)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {returnItem.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        onClick={() => handleApproveReturn(returnItem.id)}
                        disabled={updateReturnMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleRejectReturn(returnItem.id)}
                        disabled={updateReturnMutation.isPending}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
