import { Order } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface OrderListProps {
  orders?: Order[];
  onViewDetails: (orderId: number) => void;
  isLoading: boolean;
  error: Error | null;
}

export default function OrderList({ orders, onViewDetails, isLoading, error }: OrderListProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "processing":
        return <Badge variant="info">Processing</Badge>;
      case "shipped":
      case "in transit":
        return <Badge variant="warning">In Transit</Badge>;
      case "delivered":
        return <Badge variant="info">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="error">Cancelled</Badge>;
      case "refunded":
        return <Badge variant="error">Refunded</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
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
            <p className="font-semibold">Error loading orders</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orders?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">There are no orders matching your criteria.</p>
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
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Escrow</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.customerEmail}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-gray-500" />
                  <span className="text-sm">{formatDate(order.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{getStatusBadge(order.escrowStatus)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(order.id)}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
