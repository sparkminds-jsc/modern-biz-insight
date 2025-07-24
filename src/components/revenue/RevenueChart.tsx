import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, addMonths, isSameMonth, isSameYear } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RevenueChartProps {
  startDate?: Date;
  endDate?: Date;
}

interface ChartData {
  monthYear: string;
  totalRevenue: number;
}

export function RevenueChart({ startDate, endDate }: RevenueChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      fetchChartData();
    } else {
      setChartData([]);
    }
  }, [startDate, endDate]);

  const fetchChartData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      // Fetch all revenue data
      const { data: revenues, error } = await supabase
        .from('revenue')
        .select('*')
        .order('created_date');

      if (error) throw error;

      // Generate months between start and end date
      const months: Date[] = [];
      let currentMonth = startOfMonth(startDate);
      const endMonth = startOfMonth(endDate);

      while (currentMonth <= endMonth) {
        months.push(new Date(currentMonth));
        currentMonth = addMonths(currentMonth, 1);
      }

      // Calculate total revenue for each month
      const chartData: ChartData[] = months.map(month => {
        const monthRevenues = revenues?.filter(revenue => {
          const revenueDate = new Date(revenue.created_date);
          return isSameMonth(revenueDate, month) && isSameYear(revenueDate, month);
        }) || [];

        const totalRevenue = monthRevenues.reduce((sum, revenue) => {
          return sum + 
            (revenue.amount_vnd || 0) + 
            ((revenue.amount_usd || 0) * 25000) + 
            ((revenue.amount_usdt || 0) * 25000);
        }, 0);

        return {
          monthYear: format(month, 'MM/yyyy', { locale: vi }),
          totalRevenue: Math.round(totalRevenue)
        };
      });

      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `${Math.round(value).toLocaleString('vi-VN')} VND`;
  };

  if (!startDate || !endDate) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu theo tháng</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Vui lòng chọn ngày bắt đầu và ngày đến để xem biểu đồ
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu theo tháng</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu theo tháng</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Không có dữ liệu trong khoảng thời gian này
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu theo tháng</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="monthYear" 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="text-gray-600"
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Tổng doanh thu']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="totalRevenue" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}