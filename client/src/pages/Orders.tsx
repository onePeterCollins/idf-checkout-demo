import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import OrderList from "@/components/orders/OrderList";
import OrderDetails from "@/components/orders/OrderDetails";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@shared/schema";

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['/api/orders'],
  });

  const handleViewDetails = (orderId: number) => {
    setSelectedOrder(orderId);
  };

  const handleDialogClose = () => {
    setSelectedOrder(null);
  };

  const handleOrderStatusUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    queryClient.invalidateQueries({ queryKey: ['/api/orders/recent'] });
    queryClient.invalidateQueries({ queryKey: ['/api/analytics/dashboard'] });
  };

  const pendingOrders = orders?.filter(o => o.status === 'pending');
  const processingOrders = orders?.filter(o => o.status === 'processing');
  const shippedOrders = orders?.filter(o => o.status === 'shipped' || o.status === 'delivered');
  const completedOrders = orders?.filter(o => o.status === 'completed');
  const problemOrders = orders?.filter(o => o.status === 'cancelled' || o.status === 'refunded');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage customer orders and track their status</p>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OrderList 
            orders={orders} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="pending">
          <OrderList 
            orders={pendingOrders} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="processing">
          <OrderList 
            orders={processingOrders} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="shipped">
          <OrderList 
            orders={shippedOrders} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="completed">
          <OrderList 
            orders={completedOrders} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="problems">
          <OrderList 
            orders={problemOrders} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={selectedOrder !== null} onOpenChange={() => handleDialogClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetails 
              orderId={selectedOrder} 
              onStatusUpdate={handleOrderStatusUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
