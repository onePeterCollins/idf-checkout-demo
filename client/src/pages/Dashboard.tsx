import { useQuery } from "@tanstack/react-query";
import StatsOverview from "@/components/dashboard/StatsOverview";
import SocialMediaImports from "@/components/dashboard/SocialMediaImports";
import RecentOrders from "@/components/dashboard/RecentOrders";
import ProductsAndCategories from "@/components/dashboard/ProductsAndCategories";
import TrustAndSecurity from "@/components/dashboard/TrustAndSecurity";
import CheckoutFlowPreview from "@/components/dashboard/CheckoutFlowPreview";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Stats Overview */}
      <StatsOverview stats={data.stats} />
      
      {/* Social Media Imports */}
      <SocialMediaImports />
      
      {/* Recent Orders */}
      <RecentOrders orders={data.recentOrders} />
      
      {/* Products & Categories */}
      <ProductsAndCategories 
        categories={data.productCountsByCategory} 
        promotions={data.activeDiscounts} 
      />
      
      {/* Checkout Process Preview */}
      <div className="mt-12 pt-12 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Secure Checkout Process</h2>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Configure
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Preview
            </button>
          </div>
        </div>

        <CheckoutFlowPreview />
      </div>
      
      {/* Trust and Security Section */}
      <TrustAndSecurity />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-50 rounded-md p-3">
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32 mt-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <Skeleton className="h-6 w-48" />
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-5 w-24 mx-auto mt-3" />
                <Skeleton className="h-3 w-32 mx-auto mt-2" />
                <Skeleton className="h-8 w-20 mx-auto mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-64 w-full mt-4" />
      </div>
    </div>
  );
}
