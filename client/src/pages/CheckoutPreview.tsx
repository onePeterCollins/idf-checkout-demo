import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ChevronLeft, Shield, CheckCircle, Truck, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPreview() {
  const [currentTab, setCurrentTab] = useState("checkout");

  const tabs = [
    { id: "checkout", label: "Checkout Flow" },
    { id: "escrow", label: "Escrow Service" },
    { id: "returns", label: "Returns & Refunds" },
    { id: "logistics", label: "Logistics" },
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/">
          <a className="inline-flex items-center mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </a>
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Secure Checkout Process</h1>
      </div>

      <Tabs defaultValue="checkout" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="checkout">
          <CheckoutFlow />
        </TabsContent>

        <TabsContent value="escrow">
          <EscrowService />
        </TabsContent>

        <TabsContent value="returns">
          <ReturnsAndRefunds />
        </TabsContent>

        <TabsContent value="logistics">
          <LogisticsInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CheckoutFlow() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6">Checkout Flow</h3>
        
        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <CheckoutStep number={1} label="Cart Review" status="completed" />
            <div className="flex-1 h-0.5 bg-primary-50 mx-2"></div>
            <CheckoutStep number={2} label="Shipping" status="completed" />
            <div className="flex-1 h-0.5 bg-primary-50 mx-2"></div>
            <CheckoutStep number={3} label="Payment" status="current" />
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            <CheckoutStep number={4} label="Confirmation" status="upcoming" />
          </div>
        </div>
        
        {/* Payment Section */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h4>
          <p className="text-sm text-gray-500 mb-6">Your payment is protected by our secure escrow service. Funds are only released to the seller after you've received and approved your order.</p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input id="card" name="payment_method" type="radio" checked className="h-4 w-4 text-primary focus:ring-primary border-gray-300" readOnly />
              <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">Credit or debit card</label>
            </div>
            
            <div className="ml-7 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</label>
                <div className="mt-1">
                  <Input type="text" id="card-number" name="card-number" placeholder="4242 4242 4242 4242" />
                </div>
              </div>
              
              <div>
                <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">Name on card</label>
                <div className="mt-1">
                  <Input type="text" id="name-on-card" name="name-on-card" placeholder="John Smith" />
                </div>
              </div>
              
              <div>
                <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                <div className="mt-1">
                  <Input type="text" id="expiration-date" name="expiration-date" placeholder="12/25" />
                </div>
              </div>
              
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                <div className="mt-1">
                  <Input type="text" id="cvc" name="cvc" placeholder="123" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex items-center p-2 bg-gray-100 rounded-md">
              <Shield className="h-5 w-5 text-gray-700" />
            </div>
            <div className="flex items-center p-2 bg-blue-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center p-2 bg-red-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm2 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center p-2 bg-yellow-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-700" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h4>
          
          <div className="flow-root">
            <ul role="list" className="-my-4 divide-y divide-gray-200">
              <li className="flex py-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>Premium Headphones</h3>
                      <p className="ml-4">$159.00</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Black</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty 1</p>
                  </div>
                </div>
              </li>
              <li className="flex py-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>Smart Watch</h3>
                      <p className="ml-4">$249.00</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Silver</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty 1</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Subtotal</p>
              <p className="font-medium text-gray-900">$408.00</p>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <p className="text-gray-500">Shipping</p>
              <p className="font-medium text-gray-900">$12.99</p>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <p className="text-gray-500">Tax</p>
              <p className="font-medium text-gray-900">$24.48</p>
            </div>
            <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-900">Total</p>
              <p className="text-gray-900">$445.47</p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <h5 className="text-sm font-medium text-gray-900">Money-back Guarantee</h5>
                <p className="text-xs text-gray-500 mt-1">Full refund available within 14 days if you're not satisfied with your purchase.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button className="w-full">
              Place Order
            </Button>
            <p className="mt-2 text-xs text-center text-gray-500">
              By placing your order, you agree to our 
              <Link href="/terms">
                <a className="text-primary hover:text-primary/80"> Terms of Service </a>
              </Link>
              and
              <Link href="/privacy">
                <a className="text-primary hover:text-primary/80"> Privacy Policy</a>
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EscrowService() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Escrow Service</CardTitle>
        <CardDescription>
          Our secure escrow payment service protects both buyers and sellers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 p-6 border rounded-lg bg-gray-50">
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Buyer places an order and makes payment</li>
                <li>Funds are securely held in escrow</li>
                <li>Seller ships the product to the buyer</li>
                <li>Buyer receives and inspects the product</li>
                <li>Funds are released to the seller when buyer approves</li>
              </ol>
            </div>
            <div className="flex-1 p-6 border rounded-lg bg-gray-50">
              <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
              <h3 className="text-lg font-medium mb-2">Benefits</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Secure payment protection for both parties</li>
                <li>Eliminates risk of fraud or scams</li>
                <li>Build trust with your customers</li>
                <li>Automated process with clear communication</li>
                <li>Dispute resolution available if needed</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Escrow Payment Flow</h3>
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <span className="text-blue-800 font-bold">1</span>
                </div>
                <span className="text-sm font-medium">Payment</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  Customer makes payment which is held in escrow
                </p>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-400 self-center" />
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                  <span className="text-indigo-800 font-bold">2</span>
                </div>
                <span className="text-sm font-medium">Shipping</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  You ship the item to the customer
                </p>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-400 self-center" />
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <span className="text-purple-800 font-bold">3</span>
                </div>
                <span className="text-sm font-medium">Inspection</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  Customer receives and inspects the item
                </p>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-400 self-center" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <span className="text-green-800 font-bold">4</span>
                </div>
                <span className="text-sm font-medium">Payment Release</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  Funds are released to you after approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReturnsAndRefunds() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Returns & Refunds Policy</CardTitle>
        <CardDescription>
          Our hassle-free return and refund policy ensures customer satisfaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-gray-50">
              <RefreshCcw className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Customer Return Process</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Customer requests a return within 14 days</li>
                <li>You review and approve the return</li>
                <li>Customer ships the item back</li>
                <li>You inspect the returned item</li>
                <li>Refund is issued to the customer</li>
              </ol>
            </div>
            <div className="p-6 border rounded-lg bg-gray-50">
              <Shield className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Money-Back Guarantee</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our platform offers a full money-back guarantee to protect customers 
                and build trust in your products and services.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Full refund for damaged or incorrect items</li>
                <li>Partial refund options available</li>
                <li>Transparent communication throughout</li>
              </ul>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Return Eligibility Criteria</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Damaged or Defective Items</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Items that arrive damaged or have manufacturing defects qualify for a full refund or replacement.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Incorrect or Missing Items</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    If a customer receives the wrong item or their order is incomplete, they can request a return.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Change of Mind</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Customers can return items they no longer want within 14 days, provided the items are in original condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LogisticsInfo() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Logistics Integration</CardTitle>
        <CardDescription>
          Streamlined shipping and delivery management for your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-gray-50">
            <Truck className="h-10 w-10 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Shipping Partners</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our platform integrates with major shipping carriers to provide reliable delivery services.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <span className="font-semibold text-gray-700">FedEx</span>
              </div>
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <span className="font-semibold text-gray-700">UPS</span>
              </div>
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <span className="font-semibold text-gray-700">USPS</span>
              </div>
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <span className="font-semibold text-gray-700">DHL</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Order Tracking</h3>
              <p className="text-sm text-gray-600 mb-4">
                Provide real-time tracking information to customers so they can monitor their order's journey.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Automatic tracking number generation</li>
                <li>Real-time status updates</li>
                <li>Email and SMS notifications</li>
                <li>Delivery confirmation</li>
              </ul>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Shipping Options</h3>
              <p className="text-sm text-gray-600 mb-4">
                Offer flexible shipping options to meet customer expectations.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Standard shipping (3-5 business days)</li>
                <li>Express shipping (1-2 business days)</li>
                <li>Same-day delivery (select locations)</li>
                <li>International shipping</li>
              </ul>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Shipping Process</h3>
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <span className="text-blue-800 font-bold">1</span>
                </div>
                <span className="text-sm font-medium">Order Processing</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  Order is received and prepared for shipping
                </p>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-400 self-center" />
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                  <span className="text-indigo-800 font-bold">2</span>
                </div>
                <span className="text-sm font-medium">Shipping Label</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  Shipping label generated and package prepared
                </p>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-400 self-center" />
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <span className="text-purple-800 font-bold">3</span>
                </div>
                <span className="text-sm font-medium">In Transit</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  Package is in transit to the customer
                </p>
              </div>
              <ChevronRight className="hidden md:block h-5 w-5 text-gray-400 self-center" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <span className="text-green-800 font-bold">4</span>
                </div>
                <span className="text-sm font-medium">Delivered</span>
                <p className="text-xs text-gray-500 text-center max-w-xs mt-1">
                  Package is delivered to the customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CheckoutStepProps {
  number: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

function CheckoutStep({ number, label, status }: CheckoutStepProps) {
  let stepClasses = '';
  
  switch (status) {
    case 'completed':
      stepClasses = 'bg-primary-50 text-primary';
      break;
    case 'current':
      stepClasses = 'bg-white border-2 border-primary text-primary';
      break;
    case 'upcoming':
      stepClasses = 'bg-gray-100 text-gray-500';
      break;
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${stepClasses}`}>
        {number}
      </div>
      <div className={`text-xs mt-2 ${status === 'current' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
        {label}
      </div>
    </div>
  );
}
