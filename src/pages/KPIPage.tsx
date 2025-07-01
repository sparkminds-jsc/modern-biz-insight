
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KPIFilters } from '../components/kpi/KPIFilters';
import { KPITable } from '../components/kpi/KPITable';
import { CreateKPIDialog } from '../components/kpi/CreateKPIDialog';
import { KPIActionDialogs } from '../components/kpi/KPIActionDialogs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KPIRecord {
  id: string;
  year: number;
  month: number;
  total_employees_with_kpi_gap: number;
  status?: string;
}

const KPIPage = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Data state
  const [kpiRecords, setKpiRecords] = useState<KPIRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState<{ id: string; year: number; month: number } | null>(null);

  useEffect(() => {
    fetchKPIRecords();
  }, []);

  const fetchKPIRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kpi_records')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      setKpiRecords(data || []);
    } catch (error) {
      console.error('Error fetching KPI records:', error);
      toast.error('Không thể tải dữ liệu KPI');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKPI = () => {
    setShowCreateDialog(true);
  };

  const handleCreateConfirm = async (month: number, year: number) => {
    try {
      // Check if record already exists
      const { data: existingRecord } = await supabase
        .from('kpi_records')
        .select('id')
        .eq('month', month)
        .eq('year', year)
        .single();

      if (existingRecord) {
        toast.error(`KPI cho tháng ${month}/${year} đã tồn tại`);
        return;
      }

      // Create new KPI record
      const { error } = await supabase
        .from('kpi_records')
        .insert({
          month,
          year,
          total_employees_with_kpi_gap: 0,
          status: 'Đang xử lý'
        });

      if (error) throw error;

      toast.success(`KPI cho tháng ${month}/${year} đã được tạo thành công`);
      
      // Refresh data
      await fetchKPIRecords();
      
      // Navigate to the newly created KPI detail page
      navigate(`/kpi/detail/${year}/${month}`);
    } catch (error) {
      console.error('Error creating KPI record:', error);
      toast.error('Không thể tạo KPI mới');
    }
  };

  const handleComplete = (id: string, year: number, month: number) => {
    setSelectedKPI({ id, year, month });
    setShowCompleteDialog(true);
  };

  const handleConfirmComplete = async () => {
    if (!selectedKPI) return;

    try {
      const { error } = await supabase
        .from('kpi_records')
        .update({ status: 'Hoàn thành' })
        .eq('id', selectedKPI.id);

      if (error) throw error;

      toast.success('KPI đã được đánh dấu hoàn thành');
      await fetchKPIRecords();
      setShowCompleteDialog(false);
      setSelectedKPI(null);
    } catch (error) {
      console.error('Error completing KPI:', error);
      toast.error('Không thể hoàn thành KPI');
    }
  };

  const handleDelete = (id: string, year: number, month: number) => {
    setSelectedKPI({ id, year, month });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedKPI) return;

    try {
      // First delete all related KPI details
      const { error: detailsError } = await supabase
        .from('kpi_details')
        .delete()
        .eq('year', selectedKPI.year)
        .eq('month', selectedKPI.month);

      if (detailsError) throw detailsError;

      // Then delete the KPI record
      const { error: recordError } = await supabase
        .from('kpi_records')
        .delete()
        .eq('id', selectedKPI.id);

      if (recordError) throw recordError;

      toast.success('KPI đã được xóa thành công');
      await fetchKPIRecords();
      setShowDeleteDialog(false);
      setSelectedKPI(null);
    } catch (error) {
      console.error('Error deleting KPI:', error);
      toast.error('Không thể xóa KPI');
    }
  };

  const handleViewDetail = (year: number, month: number) => {
    navigate(`/kpi/detail/${year}/${month}`);
  };

  // Filter KPI records based on selected filters
  const filteredKPIRecords = kpiRecords.filter(record => {
    const monthMatch = selectedMonths.length === 0 || selectedMonths.includes(record.month);
    const yearMatch = selectedYears.length === 0 || selectedYears.includes(record.year);
    return monthMatch && yearMatch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý KPI</h1>
          <p className="text-gray-600">Đánh giá hiệu suất làm việc</p>
        </div>

        {/* Filters */}
        <KPIFilters
          selectedMonths={selectedMonths}
          selectedYears={selectedYears}
          onMonthsChange={setSelectedMonths}
          onYearsChange={setSelectedYears}
          onCreateKPI={handleCreateKPI}
        />

        {/* KPI Table */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <KPITable
            data={filteredKPIRecords}
            onViewDetail={handleViewDetail}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        )}

        {/* Create KPI Dialog */}
        <CreateKPIDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreate={handleCreateConfirm}
        />

        {/* Action Dialogs */}
        <KPIActionDialogs
          showCompleteDialog={showCompleteDialog}
          onCloseCompleteDialog={() => {
            setShowCompleteDialog(false);
            setSelectedKPI(null);
          }}
          onConfirmComplete={handleConfirmComplete}
          showDeleteDialog={showDeleteDialog}
          onCloseDeleteDialog={() => {
            setShowDeleteDialog(false);
            setSelectedKPI(null);
          }}
          onConfirmDelete={handleConfirmDelete}
          selectedKPI={selectedKPI}
        />
      </div>
    </AppLayout>
  );
};

export default KPIPage;
