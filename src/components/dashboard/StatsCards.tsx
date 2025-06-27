
import { Users, DollarSign, TrendingDown, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface StatsCardsProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

export function StatsCards({ fromDate, toDate, onFromDateChange, onToDateChange }: StatsCardsProps) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalRevenue: 0,
    totalExpenses: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!fromDate || !toDate) return;
    
    setLoading(true);
    try {
      // Fetch total employees with status "Đang làm"
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id')
        .eq('status', 'Đang làm');

      if (employeesError) throw employeesError;

      // Fetch total revenue (VND only) within date range
      const { data: revenue, error: revenueError } = await supabase
        .from('revenue')
        .select('amount_vnd')
        .gte('created_date', fromDate)
        .lte('created_date', toDate);

      if (revenueError) throw revenueError;

      // Fetch total expenses (VND + cash) within date range
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount_vnd')
        .gte('created_date', fromDate)
        .lte('created_date', toDate);

      if (expensesError) throw expensesError;

      const totalEmployees = employees?.length || 0;
      const totalRevenue = revenue?.reduce((sum, item) => sum + (item.amount_vnd || 0), 0) || 0;
      const totalExpenses = expenses?.reduce((sum, item) => sum + (item.amount_vnd || 0), 0) || 0;

      setStats({
        totalEmployees,
        totalRevenue,
        totalExpenses
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu thống kê',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchStats();
    }
  }, [fromDate, toDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Tổng số nhân viên',
      value: stats.totalEmployees.toString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Chi phí',
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingDown,
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Date Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Từ:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Đến:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
