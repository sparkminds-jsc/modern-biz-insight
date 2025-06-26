
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KPIFilters } from '../components/kpi/KPIFilters';
import { KPITable } from '../components/kpi/KPITable';
import { CreateKPIDialog } from '../components/kpi/CreateKPIDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KPIRecord {
  id: string;
  year: number;
  month: number;
  total_employees_with_kpi_gap: number;
}

const KPIPage = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  
  // Dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Data state
  const [kpiRecords, setKpiRecords] = useState<KPIRecord[]>([]);
  const [loading, setLoading] = useState(true);

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
          total_employees_with_kpi_gap: 0
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
          />
        )}

        {/* Create KPI Dialog */}
        <CreateKPIDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreate={handleCreateConfirm}
        />
      </div>
    </AppLayout>
  );
};

export default KPIPage;
