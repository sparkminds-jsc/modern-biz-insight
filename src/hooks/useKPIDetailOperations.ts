
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KPIDetail, KPIDetailData } from '@/types/kpiDetail';
import { formatKPINumber } from '@/utils/numberFormat';

export const useKPIDetailOperations = (
  kpiDetails: KPIDetail[],
  year?: string,
  month?: string,
  onRefresh?: () => void
) => {
  const navigate = useNavigate();
  
  // Edit form states
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingKPIDetail, setEditingKPIDetail] = useState(null);

  // Copy KPI states
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  // Delete confirmation states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingKPIDetail, setDeletingKPIDetail] = useState<KPIDetailData | null>(null);

  // Salary sheet incomplete notification state
  const [showSalaryIncompleteDialog, setShowSalaryIncompleteDialog] = useState(false);

  const handleAddKPI = () => {
    setEditingKPIDetail(null);
    setShowEditForm(true);
  };

  const handleCopyKPI = () => {
    setShowCopyDialog(true);
  };

  const handleCopyConfirm = async (copyMonth: number, copyYear: number) => {
    try {
      console.log('Starting copy process for month:', copyMonth, 'year:', copyYear);
      
      // First check if salary sheet exists and is completed
      const { data: salarySheet, error: salarySheetError } = await supabase
        .from('salary_sheets')
        .select('id, status')
        .eq('month', copyMonth)
        .eq('year', copyYear)
        .maybeSingle();

      console.log('Salary sheet query result:', salarySheet, salarySheetError);

      if (salarySheetError) {
        console.error('Error fetching salary sheet:', salarySheetError);
        toast.error('Không thể kiểm tra bảng lương');
        return;
      }

      if (!salarySheet) {
        toast.error('Bảng lương của tháng/năm đã chọn không tồn tại');
        return;
      }

      if (salarySheet.status !== 'Hoàn thành') {
        setShowSalaryIncompleteDialog(true);
        return;
      }

      // Get all salary details for the selected month/year
      const { data: salaryDetails, error: salaryDetailsError } = await supabase
        .from('salary_details')
        .select('employee_code, gross_salary, kpi_bonus')
        .eq('salary_sheet_id', salarySheet.id);

      console.log('Salary details query result:', salaryDetails, salaryDetailsError);

      if (salaryDetailsError) {
        console.error('Error fetching salary details:', salaryDetailsError);
        toast.error('Không thể tải dữ liệu bảng lương');
        return;
      }

      // Create a map of salary data by employee code
      const salaryDataMap = new Map();
      (salaryDetails || []).forEach(detail => {
        salaryDataMap.set(detail.employee_code, {
          basic_salary: detail.gross_salary || 0,
          kpi: detail.kpi_bonus || 0
        });
      });

      console.log('Salary data map:', salaryDataMap);

      // Check if target month/year already has KPI details
      const { data: existingKPIDetails, error: existingKPIError } = await supabase
        .from('kpi_details')
        .select('id')
        .eq('month', copyMonth)
        .eq('year', copyYear)
        .limit(1);

      if (existingKPIError) {
        console.error('Error checking existing KPI details:', existingKPIError);
        toast.error('Không thể kiểm tra dữ liệu KPI hiện tại');
        return;
      }

      if (existingKPIDetails && existingKPIDetails.length > 0) {
        toast.error(`KPI chi tiết cho tháng ${copyMonth}/${copyYear} đã tồn tại`);
        return;
      }

      // Copy all KPI details to the new month/year with updated salary data
      const copyData = kpiDetails.map(detail => {
        const salaryData = salaryDataMap.get(detail.employee_code);
        const basicSalary = salaryData?.basic_salary || 0;
        const kpi = salaryData?.kpi || 0;
        const totalSalary = basicSalary + kpi;
        const salaryCoefficient = basicSalary > 0 ? parseFloat((kpi / basicSalary).toFixed(3)) : 0;

        return {
          employee_code: detail.employee_code,
          month: copyMonth,
          year: copyYear,
          has_kpi_gap: detail.has_kpi_gap,
          basic_salary: basicSalary,
          kpi: kpi,
          total_salary: totalSalary,
          salary_coefficient: salaryCoefficient,
          kpi_coefficient: detail.kpi_coefficient,
          total_monthly_kpi: detail.total_monthly_kpi,
          work_productivity: detail.work_productivity,
          work_quality: detail.work_quality,
          attitude: detail.attitude,
          progress: detail.progress,
          requirements: detail.requirements,
          recruitment: detail.recruitment,
          revenue: detail.revenue
        };
      });

      console.log('Data to copy:', copyData);

      const { data: insertResult, error: insertError } = await supabase
        .from('kpi_details')
        .insert(copyData);

      console.log('Insert result:', insertResult, insertError);

      if (insertError) {
        console.error('Error inserting KPI details:', insertError);
        toast.error('Không thể copy KPI chi tiết');
        return;
      }

      // Update KPI record count
      const kpiGapCount = copyData.filter(item => item.has_kpi_gap).length;
      const { error: upsertError } = await supabase
        .from('kpi_records')
        .upsert({
          month: copyMonth,
          year: copyYear,
          total_employees_with_kpi_gap: kpiGapCount
        });

      if (upsertError) {
        console.error('Error updating KPI record count:', upsertError);
        // Don't return here, the copy was successful even if the count update failed
      }

      toast.success(`KPI đã được copy sang tháng ${copyMonth}/${copyYear} với dữ liệu lương cập nhật`);
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
    if (onRefresh) {
      await onRefresh();
    }
    toast.success('KPI đã được lưu thành công');
  };

  const handleBackToKPI = () => {
    navigate('/kpi');
  };

  const handleDownloadExcel = (filteredData: KPIDetailData[]) => {
    // Create CSV content for KPI details with all detailed columns
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
      // Năng suất làm việc
      '(NSLV) - Tổng',
      '(NSLV) - Hoàn thành đúng deadline',
      '(NSLV) - Task trễ deadline',
      '(NSLV) - Đạt chỉ tiêu task',
      '(NSLV) - LOC vượt chỉ tiêu',
      '(NSLV) - LOT vượt chỉ tiêu',
      '(NSLV) - Tỷ lệ effort',
      '(NSLV) - Git activity',
      // Chất lượng công việc
      '(CLCV) - Tổng',
      '(CLCV) - Bug production',
      '(CLCV) - Bug testing',
      '(CLCV) - Tỷ lệ merge',
      // Thái độ làm việc
      '(TDLV) - Tổng',
      '(TDLV) - Thái độ tích cực',
      '(TDLV) - Tech sharing',
      '(TDLV) - Bài viết kỹ thuật',
      '(TDLV) - Số NV đào tạo',
      '(TDLV) - Quản lý team',
      // Tiến độ công việc
      '(TDCV) - Tổng',
      '(TDCV) - Hoàn thành đúng tiến độ',
      '(TDCV) - Story point đúng plan',
      '(TDCV) - Thay đổi kế hoạch',
      // Yêu cầu công việc
      '(YCCV) - Tổng',
      '(YCCV) - Yêu cầu thay đổi',
      '(YCCV) - Lỗi hiểu sai YC',
      // Tuyển dụng
      '(TD) - Tổng',
      '(TD) - CV tuyển dụng',
      '(TD) - Ứng viên vượt qua',
      '(TD) - Chi phí/ứng viên',
      // Doanh thu
      'KH >100tr/tháng'
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
        // Năng suất làm việc
        formatKPINumber(detail.workProductivity.total),
        formatKPINumber(detail.workProductivity.completedOnTime),
        formatKPINumber(detail.workProductivity.overdueTask),
        formatKPINumber(detail.workProductivity.taskTarget),
        formatKPINumber(detail.workProductivity.locTarget),
        formatKPINumber(detail.workProductivity.lotTarget),
        formatKPINumber(detail.workProductivity.effortRatio),
        formatKPINumber(detail.workProductivity.gitActivity),
        // Chất lượng công việc
        formatKPINumber(detail.workQuality.total),
        formatKPINumber(detail.workQuality.prodBugs),
        formatKPINumber(detail.workQuality.testBugs),
        formatKPINumber(detail.workQuality.mergeRatio),
        // Thái độ làm việc
        formatKPINumber(detail.attitude.total),
        formatKPINumber(detail.attitude.positiveAttitude),
        formatKPINumber(detail.attitude.techSharing),
        formatKPINumber(detail.attitude.techArticles),
        formatKPINumber(detail.attitude.mentoring),
        formatKPINumber(detail.attitude.teamManagement),
        // Tiến độ công việc
        formatKPINumber(detail.progress.total),
        formatKPINumber(detail.progress.onTimeCompletion),
        formatKPINumber(detail.progress.storyPointAccuracy),
        formatKPINumber(detail.progress.planChanges),
        // Yêu cầu công việc
        formatKPINumber(detail.requirements.total),
        formatKPINumber(detail.requirements.changeRequests),
        formatKPINumber(detail.requirements.misunderstandingErrors),
        // Tuyển dụng
        formatKPINumber(detail.recruitment.total),
        formatKPINumber(detail.recruitment.cvCount),
        formatKPINumber(detail.recruitment.passedCandidates),
        formatKPINumber(detail.recruitment.recruitmentCost),
        // Doanh thu
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

  const handleDelete = (id: string, filteredData: KPIDetailData[]) => {
    const kpiDetail = filteredData.find(item => item.id === id);
    if (kpiDetail) {
      setDeletingKPIDetail(kpiDetail);
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingKPIDetail) return;

    try {
      const { error } = await supabase
        .from('kpi_details')
        .delete()
        .eq('id', deletingKPIDetail.id);

      if (error) throw error;

      toast.success('Đã xóa KPI chi tiết');
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error deleting KPI detail:', error);
      toast.error('Không thể xóa KPI chi tiết');
    } finally {
      setShowDeleteDialog(false);
      setDeletingKPIDetail(null);
    }
  };

  return {
    showEditForm,
    setShowEditForm,
    editingKPIDetail,
    showCopyDialog,
    setShowCopyDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    deletingKPIDetail,
    showSalaryIncompleteDialog,
    setShowSalaryIncompleteDialog,
    handleAddKPI,
    handleCopyKPI,
    handleCopyConfirm,
    handleViewDetail,
    handleEdit,
    handleFormSave,
    handleBackToKPI,
    handleDownloadExcel,
    handleDelete,
    handleDeleteConfirm
  };
};
