
import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { ExpenseFilters } from '../components/expenses/ExpenseFilters';
import { ExpenseSummary } from '../components/expenses/ExpenseSummary';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseDetailDialog } from '../components/expenses/ExpenseDetailDialog';
import { ExpenseChart } from '../components/expenses/ExpenseChart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [expenseToFinalize, setExpenseToFinalize] = useState<any>(null);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
      setFilteredExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu chi phí');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleFilter = (filters: any) => {
    setCurrentFilters(filters);
    let filtered = [...expenses];

    if (filters.startDate) {
      filtered = filtered.filter(expense => 
        new Date(expense.created_date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(expense => 
        new Date(expense.created_date) <= filters.endDate
      );
    }

    if (filters.expenseTypes && filters.expenseTypes.length > 0) {
      filtered = filtered.filter(expense => 
        filters.expenseTypes.includes(expense.expense_type)
      );
    }

    if (filters.walletType) {
      filtered = filtered.filter(expense => 
        expense.wallet_type === filters.walletType
      );
    }

    if (filters.content) {
      filtered = filtered.filter(expense => 
        expense.content.toLowerCase().includes(filters.content.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleViewDetail = (expense: any) => {
    setSelectedExpense(expense);
    setShowDetail(true);
  };

  const handleFinalizeExpense = (expense: any) => {
    setExpenseToFinalize(expense);
    setShowFinalizeDialog(true);
  };

  const confirmFinalize = async () => {
    if (!expenseToFinalize) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .update({ is_finalized: true })
        .eq('id', expenseToFinalize.id);

      if (error) throw error;

      toast.success('Chốt chi phí thành công!');
      fetchExpenses();
    } catch (error) {
      console.error('Error finalizing expense:', error);
      toast.error('Có lỗi xảy ra khi chốt chi phí');
    } finally {
      setShowFinalizeDialog(false);
      setExpenseToFinalize(null);
    }
  };

  const handleFormSuccess = () => {
    fetchExpenses();
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý chi phí</h1>
          <p className="text-gray-600">Theo dõi và kiểm soát chi phí</p>
        </div>

        {/* Filters */}
        <ExpenseFilters 
          onFilter={handleFilter}
          onAddExpense={handleAddExpense}
        />

        {/* Summary */}
        <ExpenseSummary data={filteredExpenses} />

        {/* Table */}
        <ExpenseTable 
          data={filteredExpenses}
          onViewDetail={handleViewDetail}
          onEdit={handleEditExpense}
          onFinalize={handleFinalizeExpense}
        />

        {/* Chart */}
        <ExpenseChart 
          startDate={currentFilters.startDate}
          endDate={currentFilters.endDate}
          expenseTypes={currentFilters.expenseTypes}
          content={currentFilters.content}
        />

        {/* Form Dialog */}
        <ExpenseForm
          open={showForm}
          onClose={() => setShowForm(false)}
          expense={selectedExpense}
          onSuccess={handleFormSuccess}
        />

        {/* Detail Dialog */}
        <ExpenseDetailDialog
          open={showDetail}
          onClose={() => setShowDetail(false)}
          expense={selectedExpense}
        />

        {/* Finalize Confirmation Dialog */}
        <AlertDialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận chốt chi phí</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn chốt chi phí này không? Sau khi chốt, chi phí sẽ không thể chỉnh sửa được nữa.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={confirmFinalize}>
                Xác nhận chốt
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default ExpensesPage;
