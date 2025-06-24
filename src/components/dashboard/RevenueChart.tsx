
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const data = [
  { month: 'T1', employees: 220, revenue: 750, costs: 280, salary: 165 },
  { month: 'T2', employees: 225, revenue: 780, costs: 290, salary: 168 },
  { month: 'T3', employees: 230, revenue: 800, costs: 300, salary: 172 },
  { month: 'T4', employees: 235, revenue: 820, costs: 305, salary: 175 },
  { month: 'T5', employees: 240, revenue: 840, costs: 310, salary: 178 },
  { month: 'T6', employees: 248, revenue: 850, costs: 320, salary: 180 },
];

export function RevenueChart() {
  const [fromDate, setFromDate] = useState('2024-01');
  const [toDate, setToDate] = useState('2024-06');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Thống kê theo tháng</h2>
          <p className="text-gray-600">Biểu đồ cột thống kê các chỉ số</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Từ:</label>
            <input
              type="month"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Đến:</label>
            <input
              type="month"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                const formatMap: { [key: string]: string } = {
                  employees: 'Nhân viên',
                  revenue: 'Doanh thu (M)',
                  costs: 'Chi phí (M)',
                  salary: 'Lương (M)'
                };
                return [value, formatMap[name] || name];
              }}
            />
            <Bar dataKey="employees" fill="#3B82F6" name="employees" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#10B981" name="revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="costs" fill="#EF4444" name="costs" radius={[4, 4, 0, 0]} />
            <Bar dataKey="salary" fill="#8B5CF6" name="salary" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Số lượng nhân viên</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Doanh thu (M)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Chi phí (M)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Tổng lương (M)</span>
        </div>
      </div>
    </div>
  );
}
