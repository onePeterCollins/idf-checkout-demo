import { Badge } from '@/components/ui/badge'
import { Link } from 'wouter'
import { formatDistanceToNow } from 'date-fns'

interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  price: number
  quantity: number
  total: number
}

interface Order {
  id: number
  customerName: string
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  itemCount: number
  items: OrderItem[]
}

interface RecentOrdersProps {
  orders: Order[]
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        <Link href="/orders">
          <a className="text-sm font-medium text-primary hover:text-primary/80">View all</a>
        </Link>
      </div>
      <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Order ID
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Products
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  #{order.id}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customerName}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(order.total)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link href={`/orders/${order.id}`}>
                    <a className="text-primary hover:text-primary/80">View</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: 'success' | 'warning' | 'info' | 'error'; label: string }> = {
    completed: { variant: 'success', label: 'Completed' },
    processing: { variant: 'info', label: 'Processing' },
    shipped: { variant: 'warning', label: 'In Transit' },
    delivered: { variant: 'info', label: 'Delivered' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    refunded: { variant: 'error', label: 'Refunded' },
    pending: { variant: 'warning', label: 'Pending' }
  }

  const config = statusConfig[status.toLowerCase()] || { variant: 'warning', label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (e) {
    return dateString
  }
}
