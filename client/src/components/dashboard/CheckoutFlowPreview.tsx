import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function CheckoutFlowPreview() {
  // Tabs for checkout flow sections
  const tabs = [
    { name: "Checkout Flow", current: true },
    { name: "Escrow Service", current: false },
    { name: "Returns & Refunds", current: false },
    { name: "Logistics", current: false },
  ];

  return (
    <div className="mt-6">
      {/* Checkout Process Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href="#"
              className={`${
                tab.current
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Checkout Flow Tab Content */}
      <div className="mt-6">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Checkout Flow</h3>
            
            {/* Steps Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <StepIndicator number={1} label="Cart Review" status="completed" />
                <div className="flex-1 h-0.5 bg-primary-50 mx-2"></div>
                <StepIndicator number={2} label="Shipping" status="completed" />
                <div className="flex-1 h-0.5 bg-primary-50 mx-2"></div>
                <StepIndicator number={3} label="Payment" status="current" />
                <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                <StepIndicator number={4} label="Confirmation" status="upcoming" />
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
                      <input type="text" id="card-number" name="card-number" placeholder="4242 4242 4242 4242" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">Name on card</label>
                    <div className="mt-1">
                      <input type="text" id="name-on-card" name="name-on-card" placeholder="John Smith" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                    <div className="mt-1">
                      <input type="text" id="expiration-date" name="expiration-date" placeholder="12/25" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                    <div className="mt-1">
                      <input type="text" id="cvc" name="cvc" placeholder="123" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center space-x-4">
                <div className="flex items-center p-2 bg-gray-100 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
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
                <button type="button" className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Place Order
                </button>
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
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  number: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

function StepIndicator({ number, label, status }: StepIndicatorProps) {
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
