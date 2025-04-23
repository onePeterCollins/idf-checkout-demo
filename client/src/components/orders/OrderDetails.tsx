import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Truck, 
  Package, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  Shield,
  Clock
} from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Order, OrderItem } from "@shared/schema";
import { format } from "date-fns";

interface OrderDetailsProps {
  orderId: number;
  onStatusUpdate: () => void;
}

export default function OrderDetails({ orderId, onStatusUpdate }: OrderDetailsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [escrowStatus, setEscrowStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [shippingCarrier, setShippingCarrier] = useState<string>("");

  const { data: orderData, isLoading, error } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
  });

  // Set initial values when order data is loaded
  if (orderData && orderStatus === "") {
    setOrderStatus(orderData.status);
    setPaymentStatus(orderData.paymentStatus);
    setEscrowStatus(orderData.escrowStatus);
    setTrackingNumber(orderData.trackingNumber || "");
    setShippingCarrier(orderData.shippingCarrier || "");
  }

  const updateOrderMutation = useMutation({
    mutationFn: async (data: Partial<Order>) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order updated",
        description: "The order has been updated successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${orderId}`] });
      onStatusUpdate();
    },
    onError: (error) => {
      toast({
        title: "Failed to update order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateOrder = () => {
    updateOrderMutation.mutate({
      status: orderStatus,
      paymentStatus,
      escrowStatus,
      trackingNumber: trackingNumber || undefined,
      shippingCarrier: shippingCarrier || undefined,
    });
  };

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
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      case "released":
        return <Badge variant="success">Released</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="text-center text-red-500 p-4">
        <p className="font-semibold">Error loading order details</p>
        <p className="text-sm">{error?.message || "Order not found"}</p>
      </div>
    );
  }

  const order: Order & { items: OrderItem[] } = orderData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <User className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="font-medium">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Mail className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p>{order.customerEmail}</p>
              </div>
            </div>
            {order.customerPhone && (
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <p>{order.customerPhone}</p>
                </div>
              </div>
            )}
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2">
              <Calendar className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date Ordered</p>
                <p>{format(new Date(order.createdAt), "PPP p")}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <DollarSign className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold">{formatCurrency(order.total)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 mt-0.5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Escrow Status</p>
                <div>{getStatusBadge(order.escrowStatus)}</div>
              </div>
            </div>
            {(order.trackingNumber || order.shippingCarrier) && (
              <div className="flex items-start space-x-2">
                <Truck className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Shipping</p>
                  <p>{order.shippingCarrier}{order.trackingNumber ? ` (${order.trackingNumber})` : ''}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Order Items</CardTitle>
          <CardDescription>
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Subtotal</p>
                <p>{formatCurrency(order.items.reduce((sum, item) => sum + item.total, 0))}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Shipping</p>
                <p>{formatCurrency(order.total - order.items.reduce((sum, item) => sum + item.total, 0))}</p>
              </div>
              <div className="flex justify-between font-medium pt-2">
                <p>Total</p>
                <p>{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Management */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Order Management</CardTitle>
          <CardDescription>
            Update order status and shipping information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Order Status</label>
              <Select value={orderStatus} onValueChange={setOrderStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Escrow Status</label>
              <Select value={escrowStatus} onValueChange={setEscrowStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select escrow status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Shipping Carrier</label>
              <Select 
                value={shippingCarrier} 
                onValueChange={setShippingCarrier}
                defaultValue={shippingCarrier}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Tracking Number</label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleUpdateOrder}
              disabled={updateOrderMutation.isPending}
            >
              {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-gray-500">{format(new Date(order.createdAt), "PPP p")}</p>
              </div>
            </div>
            
            {order.status !== 'pending' && (
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Order {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                  <p className="text-sm text-gray-500">Status updated</p>
                </div>
              </div>
            )}

            {order.trackingNumber && (
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Shipping Information Added</p>
                  <p className="text-sm text-gray-500">
                    {order.shippingCarrier} - Tracking Number: {order.trackingNumber}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
