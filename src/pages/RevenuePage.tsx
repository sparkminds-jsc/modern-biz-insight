
import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { RevenueFilters } from '../components/revenue/RevenueFilters';
import { RevenueSummary } from '../components/revenue/RevenueSummary';
import { RevenueTable } from '../components/revenue/RevenueTable';
import { RevenueForm } from '../components/revenue/RevenueForm';
import { RevenueDetailDialog } from '../components/revenue/RevenueDetailDialog';
import { RevenueChart } from '../components/revenue/RevenueChart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const RevenuePage = () => {
  const [revenues, setRevenues] = useState<any[]>([]);
  const [filteredRevenues, setFilteredRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [filterDates, setFilterDates] = useState<{ startDate?: Date; endDate?: Date }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const { data, error } = await supabase
        .from('revenue')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      setRevenues(data || []);
      setFilteredRevenues(data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu doanh thu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = [...revenues];

    // Store filter dates for chart
    setFilterDates({
      startDate: filters.startDate,
      endDate: filters.endDate
    });

    if (filters.startDate) {
      filtered = filtered.filter(revenue => 
        new Date(revenue.created_date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(revenue => 
        new Date(revenue.created_date) <= filters.endDate
      );
    }

    if (filters.revenueType) {
      filtered = filtered.filter(revenue => 
        revenue.revenue_type === filters.revenueType
      );
    }

    if (filters.needsDebtCollection !== undefined) {
      const needsDebt = filters.needsDebtCollection === 'true';
      filtered = filtered.filter(revenue => 
        revenue.needs_debt_collection === needsDebt
      );
    }

    if (filters.content) {
      filtered = filtered.filter(revenue => 
        revenue.content.toLowerCase().includes(filters.content.toLowerCase())
      );
    }

    if (filters.projectId) {
      filtered = filtered.filter(revenue => 
        revenue.project_id === filters.projectId
      );
    }

    setFilteredRevenues(filtered);
  };

  const handleAddRevenue = () => {
    setSelectedRevenue(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditRevenue = (revenue: any) => {
    setSelectedRevenue(revenue);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleViewDetail = (revenue: any) => {
    setSelectedRevenue(revenue);
    setShowDetail(true);
  };

  const handleFinalizeRevenue = (revenue: any) => {
    setSelectedRevenue(revenue);
    setShowFinalizeDialog(true);
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (formMode === 'create') {
        const { error } = await supabase
          .from('revenue')
          .insert([data]);

        if (error) throw error;
        toast({
          title: 'Thành công',
          description: 'Đã thêm doanh thu mới',
        });
      } else {
        const { error } = await supabase
          .from('revenue')
          .update(data)
          .eq('id', selectedRevenue.id);

        if (error) throw error;
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật doanh thu',
        });
      }

      fetchRevenues();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: formMode === 'create' ? 'Không thể thêm doanh thu' : 'Không thể cập nhật doanh thu',
        variant: 'destructive',
      });
    }
  };

  const confirmFinalize = async () => {
    try {
      const { error } = await supabase
        .from('revenue')
        .update({ is_finalized: true })
        .eq('id', selectedRevenue.id);

      if (error) throw error;
      
      toast({
        title: 'Thành công',
        description: 'Đã chốt doanh thu',
      });
      
      fetchRevenues();
      setShowFinalizeDialog(false);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể chốt doanh thu',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý doanh thu</h1>
          <p className="text-gray-600">Theo dõi và phân tích doanh thu</p>
        </div>

        {/* Filters */}
        <RevenueFilters 
          onFilter={handleFilter}
          onAddRevenue={handleAddRevenue}
        />

        {/* Summary */}
        <RevenueSummary data={filteredRevenues} />

        {/* Table */}
        <RevenueTable 
          data={filteredRevenues}
          onViewDetail={handleViewDetail}
          onEdit={handleEditRevenue}
          onFinalize={handleFinalizeRevenue}
        />

        {/* Chart */}
        <RevenueChart 
          startDate={filterDates.startDate}
          endDate={filterDates.endDate}
        />

        {/* Forms and Dialogs */}
        <RevenueForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitForm}
          revenue={selectedRevenue}
          mode={formMode}
        />

        <RevenueDetailDialog
          open={showDetail}
          onClose={() => setShowDetail(false)}
          revenue={selectedRevenue}
        />

        <AlertDialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận chốt doanh thu</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn chốt doanh thu này? Sau khi chốt, doanh thu sẽ không thể chỉnh sửa nữa.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={confirmFinalize}>Chốt doanh thu</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default RevenuePage;
