import { useMemo } from 'react';
import { ComposedChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RevenueExpenseChartProps {
  revenueData: any[];
  expenseData: any[];
  startDate?: Date;
  endDate?: Date;
}

interface ChartDataPoint {
  monthYear: string;
  totalRevenue: number;
  totalExpense: number;
  avgRevenue: number;
  avgExpense: number;
}

export function RevenueExpenseChart({ revenueData, expenseData, startDate, endDate }: RevenueExpenseChartProps) {
  const chartData = useMemo(() => {
    if (!startDate || !endDate) {
      return [];
    }

    // Generate all months between start and end date
    const months = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: startOfMonth(endDate)
    });

    const data: ChartDataPoint[] = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthYear = format(month, 'MM/yyyy', { locale: vi });

      // Filter revenue and expense data for this month
      const monthRevenues = revenueData.filter(item => {
        const itemDate = new Date(item.created_date);
        return isWithinInterval(itemDate, { start: monthStart, end: monthEnd });
      });

      const monthExpenses = expenseData.filter(item => {
        const itemDate = new Date(item.created_date);
        return isWithinInterval(itemDate, { start: monthStart, end: monthEnd });
      });

      // Calculate totals for this month
      const totalRevenue = monthRevenues.reduce((sum, item) => sum + (item.amount_vnd || 0), 0);
      const totalExpense = monthExpenses.reduce((sum, item) => sum + (item.amount_vnd || 0), 0);

      return {
        monthYear,
        totalRevenue,
        totalExpense,
        avgRevenue: 0, // Will be calculated after all months
        avgExpense: 0  // Will be calculated after all months
      };
    });

    // Calculate averages
    const totalRevenueSum = data.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalExpenseSum = data.reduce((sum, item) => sum + item.totalExpense, 0);
    const avgRevenue = data.length > 0 ? totalRevenueSum / data.length : 0;
    const avgExpense = data.length > 0 ? totalExpenseSum / data.length : 0;

    // Add averages to each data point
    return data.map(item => ({
      ...item,
      avgRevenue,
      avgExpense
    }));
  }, [revenueData, expenseData, startDate, endDate]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(0);
  };

  const formatTooltipValue = (value: number) => {
    return `${value.toLocaleString('vi-VN')} VND`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{`Tháng: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatTooltipValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!startDate || !endDate) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Biểu đồ Thu Chi Theo Tháng</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Vui lòng chọn ngày bắt đầu và ngày kết thúc để xem biểu đồ
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Biểu đồ Thu Chi Theo Tháng</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Không có dữ liệu trong khoảng thời gian được chọn
        </div>
      </div>
    );
  }

  const totalRevenue = chartData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalExpense = chartData.reduce((sum, item) => sum + item.totalExpense, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Biểu đồ Thu Chi Theo Tháng</h3>
        <div className="flex space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Tổng Doanh Thu: {formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Tổng Chi Phí: {formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="monthYear" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Revenue Bar */}
            <Bar 
              dataKey="totalRevenue" 
              fill="#3b82f6"
              name="Doanh Thu"
              radius={[4, 4, 0, 0]}
            />
            
            {/* Expense Bar */}
            <Bar 
              dataKey="totalExpense" 
              fill="#ef4444"
              name="Chi Phí"
              radius={[4, 4, 0, 0]}
            />
            
            {/* Average Revenue Line */}
            <Line 
              type="monotone" 
              dataKey="avgRevenue" 
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Doanh Thu TB"
            />
            
            {/* Average Expense Line */}
            <Line 
              type="monotone" 
              dataKey="avgExpense" 
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Chi Phí TB"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}