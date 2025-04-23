import { TrustIcons } from "@/components/ui/icons";
import { CreditCard, CheckCircle } from "lucide-react";

export default function TrustAndSecurity() {
  return (
    <div className="mt-12 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Trust & Security Features</h2>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrustFeature 
              title="Secure Escrow Service"
              description="Payments are held securely until the buyer confirms receipt and satisfaction with their order."
              icon="escrow"
            />
            
            <TrustFeature 
              title="Integrated Logistics"
              description="Track your shipments in real-time with our logistics partners network across the country."
              icon="logistics"
            />
            
            <TrustFeature 
              title="Easy Returns & Refunds"
              description="Hassle-free return process with full money-back guarantee for eligible returns."
              icon="returns"
            />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods We Accept</h3>
            <div className="flex flex-wrap items-center gap-6">
              <PaymentMethod name="Visa" />
              <PaymentMethod name="Mastercard" />
              <PaymentMethod name="American Express" />
              <PaymentMethod name="PayPal" />
              <PaymentMethod name="Apple Pay" />
              <PaymentMethod name="Google Pay" />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Why Choose Our Platform?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeaturePoint text="Buyer and seller protection with secure escrow payments" />
              <FeaturePoint text="Import products directly from social media platforms" />
              <FeaturePoint text="Automated discount and promotion management" />
              <FeaturePoint text="Real-time analytics and business insights" />
              <FeaturePoint text="Streamlined returns and refund processing" />
              <FeaturePoint text="Categorize and tag products for better organization" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TrustFeatureProps {
  title: string;
  description: string;
  icon: "escrow" | "logistics" | "returns";
}

function TrustFeature({ title, description, icon }: TrustFeatureProps) {
  const Icon = TrustIcons[icon];
  
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-50 text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function PaymentMethod({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-8 bg-gray-100 px-4 py-1 rounded">
      <CreditCard className="h-4 w-4 mr-2 text-gray-700" />
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  );
}

function FeaturePoint({ text }: { text: string }) {
  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <CheckCircle className="h-5 w-5 text-green-500" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}
