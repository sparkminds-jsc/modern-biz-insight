
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function RevenueChart() {
  const [fromDate, setFromDate] = useState('2024-01');
  const [toDate, setToDate] = useState('2024-06');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChartData = async () => {
    if (!fromDate || !toDate) return;
    
    setLoading(true);
    try {
      const fromYear = parseInt(fromDate.split('-')[0]);
      const fromMonth = parseInt(fromDate.split('-')[1]);
      const toYear = parseInt(toDate.split('-')[0]);
      const toMonth = parseInt(toDate.split('-')[1]);

      // Generate months array
      const months = [];
      let currentYear = fromYear;
      let currentMonth = fromMonth;
      
      while (currentYear < toYear || (currentYear === toYear && currentMonth <= toMonth)) {
        months.push({ year: currentYear, month: currentMonth });
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }

      const data = await Promise.all(months.map(async ({ year, month }) => {
        // Fetch employees count for this month
        const { data: employees, error: employeesError } = await supabase
          .from('employees')
          .select('id')
          .eq('status', 'Đang làm');

        if (employeesError) throw employeesError;

        // Fetch revenue for this month
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
        
        const { data: revenue, error: revenueError } = await supabase
          .from('revenue')
          .select('amount_vnd')
          .gte('created_date', startDate)
          .lte('created_date', endDate);

        if (revenueError) throw revenueError;

        // Fetch expenses for this month
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('amount_vnd')
          .gte('created_date', startDate)
          .lte('created_date', endDate);

        if (expensesError) throw expensesError;

        // Fetch salary for this month
        const { data: salarySheets, error: salaryError } = await supabase
          .from('salary_sheets')
          .select('total_payment')
          .eq('year', year)
          .eq('month', month);

        if (salaryError) throw salaryError;

        const totalEmployees = employees?.length || 0;
        const totalRevenue = revenue?.reduce((sum, item) => sum + (item.amount_vnd || 0), 0) || 0;
        const totalExpenses = expenses?.reduce((sum, item) => sum + (item.amount_vnd || 0), 0) || 0;
        const totalSalary = salarySheets?.reduce((sum, sheet) => sum + (sheet.total_payment || 0), 0) || 0;

        return {
          month: `T${month}`,
          employees: totalEmployees,
          revenue: Math.round(totalRevenue / 1000000), // Convert to millions
          costs: Math.round(totalExpenses / 1000000), // Convert to millions
          salary: Math.round(totalSalary / 1000000) // Convert to millions
        };
      }));

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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
        )}
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
