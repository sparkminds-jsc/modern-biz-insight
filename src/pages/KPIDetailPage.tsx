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
import { formatKPINumber } from '@/utils/numberFormat';

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

interface KPIDetailData {
  id: string;
  employeeCode: string;
  hasKPIGap: boolean;
  basicSalary: number;
  kpi: number;
  totalSalary: number;
  salaryCoefficient: number;
  kpiCoefficient: number;
  totalMonthlyKPI: number;
  workProductivity: {
    total: number;
    completedOnTime: number;
    overdueTask: number;
    taskTarget: number;
    locTarget: number;
    lotTarget: number;
    effortRatio: number;
    gitActivity: number;
  };
  workQuality: {
    total: number;
    prodBugs: number;
    testBugs: number;
    mergeRatio: number;
  };
  attitude: {
    total: number;
    positiveAttitude: number;
    techSharing: number;
    techArticles: number;
    mentoring: number;
    teamManagement: number;
  };
  progress: {
    total: number;
    onTimeCompletion: number;
    storyPointAccuracy: number;
    planChanges: number;
  };
  requirements: {
    total: number;
    changeRequests: number;
    misunderstandingErrors: number;
  };
  recruitment: {
    total: number;
    cvCount: number;
    passedCandidates: number;
    recruitmentCost: number;
  };
  revenue: {
    clientsOver100M: number;
  };
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
  const [filteredData, setFilteredData] = useState<KPIDetailData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIDetails();
  }, [year, month]);

  const transformKPIDetailData = (detail: KPIDetail): KPIDetailData => ({
    id: detail.id,
    employeeCode: detail.employee_code,
    hasKPIGap: detail.has_kpi_gap,
    basicSalary: detail.basic_salary,
    kpi: detail.kpi,
    totalSalary: detail.total_salary,
    salaryCoefficient: detail.salary_coefficient,
    kpiCoefficient: detail.kpi_coefficient,
    totalMonthlyKPI: detail.total_monthly_kpi,
    workProductivity: {
      total: detail.work_productivity?.total || 0,
      completedOnTime: detail.work_productivity?.completedOnTime || 0,
      overdueTask: detail.work_productivity?.overdueTask || 0,
      taskTarget: detail.work_productivity?.taskTarget || 0,
      locTarget: detail.work_productivity?.locTarget || 0,
      lotTarget: detail.work_productivity?.lotTarget || 0,
      effortRatio: detail.work_productivity?.effortRatio || 0,
      gitActivity: detail.work_productivity?.gitActivity || 0,
    },
    workQuality: {
      total: detail.work_quality?.total || 0,
      prodBugs: detail.work_quality?.prodBugs || 0,
      testBugs: detail.work_quality?.testBugs || 0,
      mergeRatio: detail.work_quality?.mergeRatio || 0,
    },
    attitude: {
      total: detail.attitude?.total || 0,
      positiveAttitude: detail.attitude?.positiveAttitude || 0,
      techSharing: detail.attitude?.techSharing || 0,
      techArticles: detail.attitude?.techArticles || 0,
      mentoring: detail.attitude?.mentoring || 0,
      teamManagement: detail.attitude?.teamManagement || 0,
    },
    progress: {
      total: detail.progress?.total || 0,
      onTimeCompletion: detail.progress?.onTimeCompletion || 0,
      storyPointAccuracy: detail.progress?.storyPointAccuracy || 0,
      planChanges: detail.progress?.planChanges || 0,
    },
    requirements: {
      total: detail.requirements?.total || 0,
      changeRequests: detail.requirements?.changeRequests || 0,
      misunderstandingErrors: detail.requirements?.misunderstandingErrors || 0,
    },
    recruitment: {
      total: detail.recruitment?.total || 0,
      cvCount: detail.recruitment?.cvCount || 0,
      passedCandidates: detail.recruitment?.passedCandidates || 0,
      recruitmentCost: detail.recruitment?.recruitmentCost || 0,
    },
    revenue: {
      clientsOver100M: detail.revenue?.clientsOver100M || 0,
    },
  });

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
      const transformedData = (data || []).map(transformKPIDetailData);
      setFilteredData(transformedData);

      // Update the KPI record count to match actual data
      await updateKPIRecordCount(data || []);
    } catch (error) {
      console.error('Error fetching KPI details:', error);
      toast.error('Không thể tải dữ liệu KPI chi tiết');
    } finally {
      setLoading(false);
    }
  };

  const updateKPIRecordCount = async (kpiDetailsData: KPIDetail[]) => {
    if (!year || !month) return;
    
    try {
      const kpiGapCount = kpiDetailsData.filter(item => item.has_kpi_gap).length;
      
      const { error } = await supabase
        .from('kpi_records')
        .update({ total_employees_with_kpi_gap: kpiGapCount })
        .eq('year', parseInt(year))
        .eq('month', parseInt(month));

      if (error) throw error;
    } catch (error) {
      console.error('Error updating KPI record count:', error);
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
    
    const transformedData = filtered.map(transformKPIDetailData);
    setFilteredData(transformedData);
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
        detail.employeeCode,
        detail.hasKPIGap ? 'Có' : 'Không',
        formatKPINumber(detail.basicSalary),
        formatKPINumber(detail.kpi),
        formatKPINumber(detail.totalSalary),
        formatKPINumber(detail.salaryCoefficient),
        formatKPINumber(detail.kpiCoefficient),
        formatKPINumber(detail.totalMonthlyKPI),
        formatKPINumber(detail.workProductivity.total),
        formatKPINumber(detail.workQuality.total),
        formatKPINumber(detail.attitude.total),
        formatKPINumber(detail.progress.total),
        formatKPINumber(detail.requirements.total),
        formatKPINumber(detail.recruitment.total),
        formatKPINumber(detail.revenue.clientsOver100M)
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

  const totalEmployeesWithKPIGap = filteredData.filter(item => item.hasKPIGap).length;

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
