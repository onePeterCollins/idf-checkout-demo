import { StatIcons } from '@/components/ui/icons'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    totalRevenue: number
    totalProfit: number
    totalCustomers: number
    activeProducts: number
  }
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const formattedStats = [
    {
      name: 'Total Sales',
      value: formatCurrency(stats.totalRevenue),
      change: 12,
      icon: StatIcons.sales,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      change: 8,
      icon: StatIcons.customers,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    },
    {
      name: 'Returned Products',
      value: stats.activeProducts,
      change: 5,
      icon: StatIcons.products,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    },
    {
      name: 'Net Profit',
      value: formatCurrency(stats.totalProfit),
      change: -3,
      icon: StatIcons.profit,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    }
  ]

  const formattedStats2 = [
    {
      name: 'New Orders',
      value: formatCurrency(stats.totalRevenue),
      change: 12,
      icon: StatIcons.sales,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    },
    {
      name: 'Orders in Progress',
      value: stats.totalCustomers,
      change: 8,
      icon: StatIcons.customers,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    },
    {
      name: 'Completed Orders',
      value: stats.activeProducts,
      change: 5,
      icon: StatIcons.products,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    },
    {
      name: 'Explore tutorials',
      value: 'Here',
      change: 0,
      icon: StatIcons.profit,
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary'
    }
  ]

  return (
    <>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {formattedStats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.iconBg} rounded-md p-3`}>
                    <Icon className={`text-xl ${stat.iconColor}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {stat.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                          <span className="sr-only">{stat.change >= 0 ? 'Increased by' : 'Decreased by'}</span>
                          {Math.abs(stat.change)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {formattedStats2.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.iconBg} rounded-md p-3`}>
                    <Icon className={`text-xl ${stat.iconColor}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {stat.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                          <span className="sr-only">{stat.change >= 0 ? 'Increased by' : 'Decreased by'}</span>
                          {Math.abs(stat.change)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
