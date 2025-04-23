import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow, addDays } from 'date-fns';

interface Category {
  categoryId: number;
  name: string;
  count: number;
}

interface Promotion {
  id: number;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

interface ProductsAndCategoriesProps {
  categories: Category[];
  promotions: Promotion[];
}

export default function ProductsAndCategories({ categories, promotions }: ProductsAndCategoriesProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Product Categories */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Product Categories</h2>
          <Link href="/categories">
            <a className="text-sm font-medium text-primary hover:text-primary/80">Manage</a>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="bg-white overflow-hidden shadow rounded-lg flex items-center justify-between p-4"
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{category.count}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} products</p>
                </div>
              </div>
              <div>
                <Link href={`/categories/${category.categoryId}`}>
                  <a className="text-primary hover:text-primary/80">
                    <ChevronRight className="h-5 w-5" />
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Promotions */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Active Promotions</h2>
          <Link href="/discounts/new">
            <a className="text-sm font-medium text-primary hover:text-primary/80">Create New</a>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="bg-white overflow-hidden shadow rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{promotion.name}</h3>
                  <div className="mt-1 flex items-center">
                    <span className="text-sm text-gray-500">{promotion.description}</span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500">
                      {getPromotionTimeInfo(promotion)}
                    </span>
                  </div>
                </div>
                <div>
                  <Badge variant={promotion.isActive ? "success" : "warning"}>
                    {promotion.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getPromotionTimeInfo(promotion: Promotion): string {
  if (!promotion.endDate && !promotion.startDate) {
    return "Ongoing";
  }
  
  const now = new Date();
  
  if (promotion.startDate) {
    const startDate = new Date(promotion.startDate);
    if (startDate > now) {
      return `Starts ${formatDistanceToNow(startDate, { addSuffix: true })}`;
    }
  }
  
  if (promotion.endDate) {
    const endDate = new Date(promotion.endDate);
    if (endDate > now) {
      return `Ends ${formatDistanceToNow(endDate, { addSuffix: true })}`;
    }
    return "Expired";
  }
  
  return "Active";
}
