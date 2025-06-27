
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface RevenueChartProps {
  fromDate: string;
  toDate: string;
}

export function RevenueChart({ fromDate, toDate }: RevenueChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChartData = async () => {
    if (!fromDate || !toDate) return;
    
    setLoading(true);
    try {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      
      // Generate months array based on the date range
      const months = [];
      let currentDate = new Date(fromDateObj.getFullYear(), fromDateObj.getMonth(), 1);
      const endDate = new Date(toDateObj.getFullYear(), toDateObj.getMonth(), 1);
      
      while (currentDate <= endDate) {
        months.push({ 
          year: currentDate.getFullYear(), 
          month: currentDate.getMonth() + 1,
          monthKey: `T${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      const data = await Promise.all(months.map(async ({ year, month, monthKey }) => {
        // Fetch employees count for this month
        const { data: employees, error: employeesError } = await supabase
          .from('employees')
          .select('id')
          .eq('status', 'Đang làm');

        if (employeesError) {
          console.error('Error fetching employees:', employeesError);
          throw employeesError;
        }

        // Get first and last day of month
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startDate = firstDay.toISOString().split('T')[0];
        const endDate = lastDay.toISOString().split('T')[0];
        
        console.log(`Fetching data for ${monthKey}: ${startDate} to ${endDate}`);
        
        // Fetch revenue for this month
        const { data: revenue, error: revenueError } = await supabase
          .from('revenue')
          .select('amount_vnd')
          .gte('created_date', startDate)
          .lte('created_date', endDate);

        if (revenueError) {
          console.error('Error fetching revenue:', revenueError);
          throw revenueError;
        }

        // Fetch expenses for this month
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount_vnd')
          .gte('created_date', startDate)
          .lte('created_date', endDate);

        if (expensesError) {
          console.error('Error fetching expenses:', expensesError);
          throw expensesError;
        }

        const totalEmployees = employees?.length || 0;
        const totalRevenue = revenue?.reduce((sum, item) => sum + (item.amount_vnd || 0), 0) || 0;
        const totalExpenses = expenses?.reduce((sum, item) => sum + (item.amount_vnd || 0), 0) || 0;

        console.log(`Month ${monthKey}:`, {
          employees: totalEmployees,
          revenue: totalRevenue,
          expenses: totalExpenses
        });

        return {
          month: monthKey,
          employees: totalEmployees,
          revenue: Math.round(totalRevenue / 1000000), // Convert to millions
          costs: Math.round(totalExpenses / 1000000) // Convert to millions
        };
      }));

      console.log('Final chart data:', data);
      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu biểu đồ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [fromDate, toDate]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Thống kê theo tháng</h2>
          <p className="text-gray-600">Biểu đồ cột thống kê các chỉ số</p>
        </div>
      </div>

      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const formatMap: { [key: string]: string } = {
                    employees: 'Nhân viên',
                    revenue: 'Doanh thu (triệu VND)',
                    costs: 'Chi phí (triệu VND)'
                  };
                  return [value, formatMap[name] || name];
                }}
              />
              <Bar dataKey="employees" fill="#3B82F6" name="employees" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#10B981" name="revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costs" fill="#EF4444" name="costs" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Số lượng nhân viên</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Doanh thu (triệu VND)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Chi phí (triệu VND)</span>
        </div>
      </div>
    </div>
  );
}
