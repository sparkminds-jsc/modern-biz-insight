import { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, addMonths, isSameMonth, isSameYear } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ExpenseChartProps {
  startDate?: Date;
  endDate?: Date;
  expenseTypes?: string[];
  content?: string;
}

interface ChartData {
  month: string;
  totalExpense: number;
  averageExpense: number;
}

export function ExpenseChart({ startDate, endDate, expenseTypes, content }: ExpenseChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      fetchChartData();
    }
  }, [startDate, endDate, expenseTypes, content]);

  const fetchChartData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      let query = supabase
        .from('expenses')
        .select('*')
        .gte('created_date', format(startDate, 'yyyy-MM-dd'))
        .lte('created_date', format(endDate, 'yyyy-MM-dd'));

      if (expenseTypes && expenseTypes.length > 0) {
        query = query.in('expense_type', expenseTypes);
      }

      if (content) {
        query = query.ilike('content', `%${content}%`);
      }

      const { data: expenses, error } = await query;

      if (error) throw error;

      // Generate months between start and end date
      const months: string[] = [];
      let currentDate = startOfMonth(startDate);
      const endMonth = startOfMonth(endDate);

      while (currentDate <= endMonth) {
        months.push(format(currentDate, 'MM/yyyy'));
        currentDate = addMonths(currentDate, 1);
      }

      // Calculate expense data for each month
      const monthlyData: ChartData[] = months.map(month => {
        const monthExpenses = expenses?.filter(expense => {
          const expenseDate = new Date(expense.created_date);
          const [monthStr, yearStr] = month.split('/');
          return isSameMonth(expenseDate, new Date(parseInt(yearStr), parseInt(monthStr) - 1)) &&
                 isSameYear(expenseDate, new Date(parseInt(yearStr), parseInt(monthStr) - 1));
        }) || [];

        const totalExpense = monthExpenses.reduce((sum, expense) => {
          return sum + (expense.amount_vnd || 0) + 
                 ((expense.amount_usd || 0) * 25000) + 
                 ((expense.amount_usdt || 0) * 25000);
        }, 0);

        return {
          month,
          totalExpense,
          averageExpense: 0 // Will be calculated after all months are processed
        };
      });

      // Calculate average expense
      const totalExpenseSum = monthlyData.reduce((sum, data) => sum + data.totalExpense, 0);
      const averageExpense = monthlyData.length > 0 ? totalExpenseSum / monthlyData.length : 0;

      // Set average for all months
      const finalData = monthlyData.map(data => ({
        ...data,
        averageExpense
      }));

      setChartData(finalData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `${Math.round(value).toLocaleString('vi-VN')} VND`;
  };

  const formatShortCurrency = (value: number) => {
    const millions = value / 1000000;
    return `${Math.round(millions)}M`;
  };

  if (!startDate || !endDate) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ chi phí theo tháng</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Vui lòng chọn ngày bắt đầu và ngày đến để xem biểu đồ
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ chi phí theo tháng</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ chi phí theo tháng</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${Math.round(value / 1000000)}M`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'totalExpense' ? 'Tổng chi phí' : 'Chi phí trung bình'
              ]}
              labelFormatter={(label) => `Tháng: ${label}`}
            />
            <Bar 
              dataKey="totalExpense" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            >
              <LabelList 
                dataKey="totalExpense" 
                position="top" 
                formatter={formatShortCurrency}
                style={{ fontSize: '12px', fill: '#374151' }}
              />
            </Bar>
            <Line 
              type="monotone" 
              dataKey="averageExpense" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#ef4444' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}