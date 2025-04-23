import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import Discounts from "@/pages/Discounts";
import Orders from "@/pages/Orders";
import Returns from "@/pages/Returns";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import CheckoutPreview from "@/pages/CheckoutPreview";

function App() {
  return (
    <TooltipProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/products" component={Products} />
          <Route path="/categories" component={Categories} />
          <Route path="/discounts" component={Discounts} />
          <Route path="/orders" component={Orders} />
          <Route path="/returns" component={Returns} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/settings" component={Settings} />
          <Route path="/checkout-preview" component={CheckoutPreview} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </TooltipProvider>
  );
}

export default App;
