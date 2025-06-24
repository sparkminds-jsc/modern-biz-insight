
import { Users, DollarSign, TrendingDown, Wallet } from 'lucide-react';

const stats = [
  {
    title: 'Tổng số nhân viên',
    value: '248',
    change: '+12',
    changeType: 'increase' as const,
    icon: Users,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Doanh thu',
    value: '₫850M',
    change: '+15%',
    changeType: 'increase' as const,
    icon: DollarSign,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Chi phí',
    value: '₫320M',
    change: '-8%',
    changeType: 'decrease' as const,
    icon: TrendingDown,
    color: 'from-red-500 to-red-600'
  },
  {
    title: 'Tổng lương',
    value: '₫180M',
    change: '+5%',
    changeType: 'increase' as const,
    icon: Wallet,
    color: 'from-purple-500 to-purple-600'
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
