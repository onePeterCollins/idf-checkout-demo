import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Package, Tag, ShoppingCart, BarChart2, RefreshCcw, Settings, User } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Discounts", href: "/discounts", icon: Tag },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Returns & Refunds", href: "/returns", icon: RefreshCcw },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-primary">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-white text-2xl font-bold">SecureVend</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    isActive
                      ? "bg-primary-foreground/20 text-white"
                      : "text-white hover:bg-primary-foreground/10",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-primary-foreground/20 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Tom Cook"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Tom Cook</p>
              <p className="text-xs font-medium text-primary-foreground/80">
                View profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
