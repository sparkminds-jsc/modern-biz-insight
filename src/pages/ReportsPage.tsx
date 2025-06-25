
import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { ReportsFilters } from '../components/reports/ReportsFilters';
import { ReportsSummary } from '../components/reports/ReportsSummary';
import { ReportsTable } from '../components/reports/ReportsTable';
import { RevenueDetailDialog } from '../components/revenue/RevenueDetailDialog';
import { ExpenseDetailDialog } from '../components/expenses/ExpenseDetailDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ReportsPage = () => {
  const [revenues, setRevenues] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredRevenues, setFilteredRevenues] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevenue, setSelectedRevenue] = useState<any>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showRevenueDetail, setShowRevenueDetail] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);

  const fetchData = async () => {
    try {
      const [revenueResult, expenseResult] = await Promise.all([
        supabase.from('revenue').select('*').order('created_date', { ascending: false }),
        supabase.from('expenses').select('*').order('created_date', { ascending: false })
      ]);

      if (revenueResult.error) throw revenueResult.error;
      if (expenseResult.error) throw expenseResult.error;

      setRevenues(revenueResult.data || []);
      setExpenses(expenseResult.data || []);
      setFilteredRevenues(revenueResult.data || []);
      setFilteredExpenses(expenseResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Combine revenue and expense data for the table
    const revenueItems = filteredRevenues.map(item => ({
      ...item,
      type: 'revenue',
      category: item.revenue_type,
      wallet_type: item.wallet_type
    }));

    const expenseItems = filteredExpenses.map(item => ({
      ...item,
      type: 'expense',
      category: item.expense_type,
      wallet_type: item.wallet_type
    }));

    const combined = [...revenueItems, ...expenseItems].sort((a, b) => 
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );

    setCombinedData(combined);
  }, [filteredRevenues, filteredExpenses]);

  const handleFilter = (filters: any) => {
    let filteredRevenue = [...revenues];
    let filteredExpense = [...expenses];

    if (filters.startDate) {
      filteredRevenue = filteredRevenue.filter(item => 
        new Date(item.created_date) >= filters.startDate
      );
      filteredExpense = filteredExpense.filter(item => 
        new Date(item.created_date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filteredRevenue = filteredRevenue.filter(item => 
        new Date(item.created_date) <= filters.endDate
      );
      filteredExpense = filteredExpense.filter(item => 
        new Date(item.created_date) <= filters.endDate
      );
    }

    if (filters.walletType) {
      filteredRevenue = filteredRevenue.filter(item => 
        item.wallet_type === filters.walletType
      );
      filteredExpense = filteredExpense.filter(item => 
        item.wallet_type === filters.walletType
      );
    }

    setFilteredRevenues(filteredRevenue);
    setFilteredExpenses(filteredExpense);
  };

  const handleViewRevenue = (revenue: any) => {
    setSelectedRevenue(revenue);
    setShowRevenueDetail(true);
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowExpenseDetail(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý báo cáo</h1>
          <p className="text-gray-600">Báo cáo thu chi và hiệu suất team</p>
        </div>

        <Tabs defaultValue="revenue-expense" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue-expense">Thu Chi</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue-expense" className="space-y-6">
            {/* Filters */}
            <ReportsFilters onFilter={handleFilter} />

            {/* Summary */}
            <ReportsSummary 
              revenueData={filteredRevenues} 
              expenseData={filteredExpenses}
            />

            {/* Table */}
            <ReportsTable 
              data={combinedData}
              onViewRevenue={handleViewRevenue}
              onViewExpense={handleViewExpense}
            />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500">Tab Team đang được phát triển</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Detail Dialogs */}
        <RevenueDetailDialog
          open={showRevenueDetail}
          onClose={() => setShowRevenueDetail(false)}
          revenue={selectedRevenue}
        />

        <ExpenseDetailDialog
          open={showExpenseDetail}
          onClose={() => setShowExpenseDetail(false)}
          expense={selectedExpense}
        />
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
