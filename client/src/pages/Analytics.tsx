import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("last30");
  
  // Calculate date range based on selection
  const getDateRange = () => {
    const endDate = new Date();
    let startDate;
    
    switch(timeRange) {
      case "last7":
        startDate = subDays(endDate, 7);
        break;
      case "last30":
        startDate = subDays(endDate, 30);
        break;
      case "last90":
        startDate = subDays(endDate, 90);
        break;
      case "lastYear":
        startDate = subDays(endDate, 365);
        break;
      default:
        startDate = subDays(endDate, 30);
    }
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
  };

  const dateRange = getDateRange();

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });

  const { data: productRevenue, isLoading: isRevenueLoading } = useQuery({
    queryKey: ['/api/analytics/product-revenue', dateRange],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(`/api/analytics/product-revenue?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      if (!res.ok) throw new Error('Failed to fetch product revenue');
      return res.json();
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Track your business performance and insights</p>
      </div>

      <div className="flex justify-end mb-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7">Last 7 days</SelectItem>
            <SelectItem value="last30">Last 30 days</SelectItem>
            <SelectItem value="last90">Last 90 days</SelectItem>
            <SelectItem value="lastYear">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      {!isDashboardLoading && dashboardData && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(dashboardData.stats.totalRevenue)} 
            increase="12%" 
            icon="sales" 
          />
          <StatCard 
            title="Total Profit" 
            value={formatCurrency(dashboardData.stats.totalProfit)} 
            increase="8%" 
            icon="profit" 
          />
          <StatCard 
            title="Customers" 
            value={dashboardData.stats.totalCustomers.toString()} 
            increase="15%" 
            icon="customers" 
          />
          <StatCard 
            title="Active Products" 
            value={dashboardData.stats.activeProducts.toString()} 
            increase="5%" 
            icon="products" 
          />
        </div>
      )}

      <Tabs defaultValue="revenue" className="mb-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Product</CardTitle>
              <CardDescription>Top performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {isRevenueLoading ? (
                <div className="h-80 flex items-center justify-center">Loading revenue data...</div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={productRevenue?.slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))} 
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#6366f1" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Sales distribution by product</CardDescription>
            </CardHeader>
            <CardContent>
              {isRevenueLoading ? (
                <div className="h-80 flex items-center justify-center">Loading product data...</div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={productRevenue?.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="revenue"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {productRevenue?.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Products by category</CardDescription>
            </CardHeader>
            <CardContent>
              {isDashboardLoading ? (
                <div className="h-80 flex items-center justify-center">Loading category data...</div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={dashboardData?.productCountsByCategory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#6366f1" name="Number of Products" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  increase: string;
  icon: "sales" | "profit" | "customers" | "products";
}

function StatCard({ title, value, increase, icon }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "sales":
        return <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
      case "profit":
        return <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case "customers":
        return <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
      case "products":
        return <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary rounded-md p-3">
            {getIcon()}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">Increased by</span>
                  {increase}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
