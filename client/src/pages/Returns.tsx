import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReturnList from "@/components/returns/ReturnList";
import ReturnForm from "@/components/returns/ReturnForm";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Return } from "@shared/schema";

export default function Returns() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const queryClient = useQueryClient();
  
  const { data: returns, isLoading, error } = useQuery({
    queryKey: ['/api/returns'],
  });

  const { data: orders } = useQuery({
    queryKey: ['/api/orders'],
  });

  const handleNewReturn = () => {
    setSelectedReturn(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (returnItem: Return) => {
    setSelectedReturn(returnItem);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedReturn(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/returns'] });
    setIsFormOpen(false);
    setSelectedReturn(null);
  };

  const pendingReturns = returns?.filter(r => r.status === 'pending');
  const approvedReturns = returns?.filter(r => r.status === 'approved');
  const completedReturns = returns?.filter(r => r.status === 'completed');
  const rejectedReturns = returns?.filter(r => r.status === 'rejected');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Returns & Refunds</h1>
          <p className="text-gray-500 mt-1">Manage customer return requests and process refunds</p>
        </div>
        <Button onClick={handleNewReturn}>
          <Plus className="mr-2 h-4 w-4" /> New Return
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Returns</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ReturnList 
            returns={returns} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="pending">
          <ReturnList 
            returns={pendingReturns} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="approved">
          <ReturnList 
            returns={approvedReturns} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="completed">
          <ReturnList 
            returns={completedReturns} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <ReturnList 
            returns={rejectedReturns} 
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedReturn ? 'Return Details' : 'New Return Request'}</DialogTitle>
            <DialogDescription>
              {selectedReturn ? 'View and update the return request' : 'Create a new return request for an order'}
            </DialogDescription>
          </DialogHeader>
          <ReturnForm 
            returnItem={selectedReturn}
            orders={orders || []}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
