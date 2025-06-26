
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KPIDetailFilters } from '../components/kpi/KPIDetailFilters';
import { KPIDetailSummary } from '../components/kpi/KPIDetailSummary';
import { KPIDetailTable } from '../components/kpi/KPIDetailTable';
import { KPIDetailEditForm } from '../components/kpi/KPIDetailEditForm';
import { CopyKPIDialog } from '../components/kpi/CopyKPIDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KPIDetail {
  id: string;
  employee_code: string;
  has_kpi_gap: boolean;
  basic_salary: number;
  kpi: number;
  total_salary: number;
  salary_coefficient: number;
  kpi_coefficient: number;
  total_monthly_kpi: number;
  work_productivity: any;
  work_quality: any;
  attitude: any;
  progress: any;
  requirements: any;
  recruitment: any;
  revenue: any;
}

const KPIDetailPage = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  
  // Filter states
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [hasKPIGap, setHasKPIGap] = useState('all');
  
  // Edit form states
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingKPIDetail, setEditingKPIDetail] = useState(null);

  // Copy KPI states
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  // Data states
  const [kpiDetails, setKpiDetails] = useState<KPIDetail[]>([]);
  const [filteredData, setFilteredData] = useState<KPIDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIDetails();
  }, [year, month]);

  const fetchKPIDetails = async () => {
    if (!year || !month) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kpi_details')
        .select('*')
        .eq('year', parseInt(year))
        .eq('month', parseInt(month))
        .order('employee_code');

      if (error) throw error;
      
      setKpiDetails(data || []);
      setFilteredData(data || []);
    } catch (error) {
      console.error('Error fetching KPI details:', error);
      toast.error('Không thể tải dữ liệu KPI chi tiết');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...kpiDetails];
    
    if (employeeCode) {
      filtered = filtered.filter(item => 
        item.employee_code.toLowerCase().includes(employeeCode.toLowerCase())
      );
    }
    
    if (hasKPIGap !== 'all') {
      const hasGap = hasKPIGap === 'yes';
      filtered = filtered.filter(item => item.has_kpi_gap === hasGap);
    }
    
    setFilteredData(filtered);
  };

  const handleAddKPI = () => {
    setEditingKPIDetail(null);
    setShowEditForm(true);
  };

  const handleCopyKPI = () => {
    setShowCopyDialog(true);
  };

  const handleCopyConfirm = async (copyMonth: number, copyYear: number) => {
    try {
      // Copy all KPI details to the new month/year
      const copyData = kpiDetails.map(detail => ({
        employee_code: detail.employee_code,
        month: copyMonth,
        year: copyYear,
        has_kpi_gap: detail.has_kpi_gap,
        basic_salary: detail.basic_salary,
        kpi: detail.kpi,
        total_salary: detail.total_salary,
        salary_coefficient: detail.salary_coefficient,
        kpi_coefficient: detail.kpi_coefficient,
        total_monthly_kpi: detail.total_monthly_kpi,
        work_productivity: detail.work_productivity,
        work_quality: detail.work_quality,
        attitude: detail.attitude,
        progress: detail.progress,
        requirements: detail.requirements,
        recruitment: detail.recruitment,
        revenue: detail.revenue
      }));

      const { error } = await supabase
        .from('kpi_details')
        .insert(copyData);

      if (error) throw error;

      // Update KPI record count
      const kpiGapCount = copyData.filter(item => item.has_kpi_gap).length;
      await supabase
        .from('kpi_records')
        .upsert({
          month: copyMonth,
          year: copyYear,
          total_employees_with_kpi_gap: kpiGapCount
        });

      toast.success(`KPI đã được copy sang tháng ${copyMonth}/${copyYear}`);
      navigate('/kpi');
    } catch (error) {
      console.error('Error copying KPI:', error);
      toast.error('Không thể copy KPI');
    }
  };

  const handleViewDetail = (id: string) => {
    toast.info(`Xem chi tiết KPI của nhân viên ${id}`);
  };

  const handleEdit = (id: string) => {
    const kpiDetail = kpiDetails.find(item => item.id === id);
    setEditingKPIDetail(kpiDetail);
    setShowEditForm(true);
  };

  const handleFormSave = async () => {
    // Refresh data after save
    await fetchKPIDetails();
    toast.success('KPI đã được lưu thành công');
  };

  const handleBackToKPI = () => {
    navigate('/kpi');
  };

  const handleDownloadExcel = () => {
    // Create CSV content for KPI details
    const headers = [
      'STT',
      'Mã NV',
      'Lệch KPI',
      'Lương cơ bản',
      'KPI (%)',
      'Tổng lương',
      'Hệ số lương',
      'Hệ số KPI',
      'Tổng KPI tháng',
      'Năng suất làm việc',
      'Chất lượng công việc',
      'Thái độ làm việc',
      'Tiến độ công việc',
      'Yêu cầu công việc',
      'Tuyển dụng',
      'Doanh thu'
    ];

    const csvRows = [
      headers.join(','),
      ...filteredData.map((detail, index) => [
        index + 1,
        detail.employee_code,
        detail.has_kpi_gap ? 'Có' : 'Không',
        Math.round(detail.basic_salary),
        detail.kpi,
        Math.round(detail.total_salary),
        detail.salary_coefficient,
        detail.kpi_coefficient,
        detail.total_monthly_kpi,
        detail.work_productivity?.total || 0,
        detail.work_quality?.total || 0,
        detail.attitude?.total || 0,
        detail.progress?.total || 0,
        detail.requirements?.total || 0,
        detail.recruitment?.total || 0,
        detail.revenue?.clientsOver100M || 0
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    
    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `KPI_Chi_tiet_${month?.padStart(2, '0')}_${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Đã tải xuống file Excel');
  };

  const totalEmployeesWithKPIGap = filteredData.filter(item => item.has_kpi_gap).length;

  useEffect(() => {
    handleSearch();
  }, [kpiDetails]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBackToKPI}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={handleDownloadExcel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Excel
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            KPI Chi tiết - {month?.padStart(2, '0')}/{year}
          </h1>
          <p className="text-gray-600">Chi tiết đánh giá KPI từng nhân viên</p>
        </div>

        {/* Filters */}
        <KPIDetailFilters
          employeeCode={employeeCode}
          employeeName={employeeName}
          hasKPIGap={hasKPIGap}
          onEmployeeCodeChange={setEmployeeCode}
          onEmployeeNameChange={setEmployeeName}
          onHasKPIGapChange={setHasKPIGap}
          onSearch={handleSearch}
          onAddKPI={handleAddKPI}
          onCopyKPI={handleCopyKPI}
        />

        {/* Summary */}
        <KPIDetailSummary totalEmployeesWithKPIGap={totalEmployeesWithKPIGap} />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <KPIDetailTable
            data={filteredData}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
          />
        )}

        {/* Edit Form */}
        <KPIDetailEditForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSave={handleFormSave}
          kpiDetail={editingKPIDetail}
          month={parseInt(month || '1')}
          year={parseInt(year || '2024')}
        />

        {/* Copy KPI Dialog */}
        <CopyKPIDialog
          isOpen={showCopyDialog}
          onClose={() => setShowCopyDialog(false)}
          onCopy={handleCopyConfirm}
        />
      </div>
    </AppLayout>
  );
};

export default KPIDetailPage;
