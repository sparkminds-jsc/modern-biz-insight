
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SalaryDetailFilters } from '../components/salary/SalaryDetailFilters';
import { SalaryDetailSummary } from '../components/salary/SalaryDetailSummary';
import { SalaryDetailTable } from '../components/salary/SalaryDetailTable';
import { SalaryDetailEditForm } from '../components/salary/SalaryDetailEditForm';
import { CopySalarySheetDialog } from '../components/salary/CopySalarySheetDialog';
import { 
  SalaryDetail, 
  SalaryDetailFilters as SalaryDetailFiltersType, 
  SalaryDetailSummary as SalaryDetailSummaryType,
  SalarySheet 
} from '@/types/salary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SalaryDetailPage = () => {
  const { salarySheetId } = useParams<{ salarySheetId: string }>();
  const navigate = useNavigate();
  const [salarySheet, setSalarySheet] = useState<SalarySheet | null>(null);
  const [salaryDetails, setSalaryDetails] = useState<SalaryDetail[]>([]);
  const [filteredSalaryDetails, setFilteredSalaryDetails] = useState<SalaryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalaryDetailFiltersType>({
    employee_code: '',
    employee_name: '',
    team: 'Tất cả'
  });
  const [summary, setSummary] = useState<SalaryDetailSummaryType>({
    total_net_salary: 0,
    total_personal_income_tax: 0,
    total_company_insurance: 0,
    total_personal_insurance: 0,
    total_payment: 0
  });

  // New state for modals
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSalaryDetail, setEditingSalaryDetail] = useState<SalaryDetail | null>(null);
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  useEffect(() => {
    console.log('SalaryDetailPage - salarySheetId:', salarySheetId);
    if (salarySheetId) {
      fetchSalarySheetAndDetails();
    } else {
      setError('Không tìm thấy ID bảng lương');
      setLoading(false);
    }
  }, [salarySheetId]);

  useEffect(() => {
    handleSearch();
  }, [salaryDetails, filters]);

  const fetchSalarySheetAndDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching salary sheet with ID:', salarySheetId);
      
      // Fetch salary sheet
      const { data: sheetData, error: sheetError } = await supabase
        .from('salary_sheets')
        .select('*')
        .eq('id', salarySheetId)
        .single();

      console.log('Salary sheet data:', sheetData);
      console.log('Salary sheet error:', sheetError);

      if (sheetError) {
        console.error('Error fetching salary sheet:', sheetError);
        throw sheetError;
      }
      
      if (!sheetData) {
        throw new Error('Không tìm thấy bảng lương');
      }

      setSalarySheet(sheetData);

      // Fetch salary details
      const { data: detailsData, error: detailsError } = await supabase
        .from('salary_details')
        .select('*')
        .eq('salary_sheet_id', salarySheetId)
        .order('employee_code');

      console.log('Salary details data:', detailsData);
      console.log('Salary details error:', detailsError);

      if (detailsError) {
        console.error('Error fetching salary details:', detailsError);
        throw detailsError;
      }

      setSalaryDetails(detailsData || []);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setError(error instanceof Error ? error.message : 'Không thể tải dữ liệu chi tiết bảng lương');
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu chi tiết bảng lương',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...salaryDetails];

    if (filters.employee_code.trim()) {
      filtered = filtered.filter(detail => 
        detail.employee_code.toLowerCase().includes(filters.employee_code.toLowerCase())
      );
    }

    if (filters.employee_name.trim()) {
      filtered = filtered.filter(detail => 
        detail.employee_name.toLowerCase().includes(filters.employee_name.toLowerCase())
      );
    }

    if (filters.team !== 'Tất cả') {
      filtered = filtered.filter(detail => detail.team === filters.team);
    }

    setFilteredSalaryDetails(filtered);

    // Calculate summary from filtered data
    const newSummary = filtered.reduce(
      (acc, detail) => ({
        total_net_salary: acc.total_net_salary + detail.net_salary,
        total_personal_income_tax: acc.total_personal_income_tax + detail.total_personal_income_tax,
        total_company_insurance: acc.total_company_insurance + detail.total_bhdn,
        total_personal_insurance: acc.total_personal_insurance + detail.total_bhnld,
        total_payment: acc.total_payment + (detail.net_salary + detail.total_personal_income_tax + detail.total_bhdn + detail.total_bhnld)
      }),
      {
        total_net_salary: 0,
        total_personal_income_tax: 0,
        total_company_insurance: 0,
        total_personal_insurance: 0,
        total_payment: 0
      }
    );

    setSummary(newSummary);
  };

  const handleViewDetail = (detail: SalaryDetail) => {
    toast({
      title: 'Chi tiết lương nhân viên',
      description: `Xem chi tiết lương của ${detail.employee_name} (${detail.employee_code})`,
    });
    // TODO: Navigate to employee salary detail modal or page
  };

  const handleEdit = (detail: SalaryDetail) => {
    setEditingSalaryDetail(detail);
    setShowEditForm(true);
  };

  const handleAddEmployee = () => {
    setEditingSalaryDetail(null);
    setShowEditForm(true);
  };

  const handleCopySalarySheet = () => {
    setShowCopyDialog(true);
  };

  const handleFormSave = () => {
    fetchSalarySheetAndDetails();
  };

  const handleCopySuccess = () => {
    navigate('/salary');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/salary')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chi tiết bảng lương</h1>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !salarySheet) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/salary')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chi tiết bảng lương</h1>
              <p className="text-gray-600">Lỗi tải dữ liệu</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-red-500">{error || 'Không tìm thấy bảng lương'}</p>
            <Button 
              onClick={fetchSalarySheetAndDetails} 
              className="mt-4"
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/salary')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết bảng lương</h1>
            <p className="text-gray-600">
              Tháng {salarySheet.month.toString().padStart(2, '0')}/{salarySheet.year}
            </p>
          </div>
        </div>

        {/* Phần 1: Filters */}
        <SalaryDetailFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onAddEmployee={handleAddEmployee}
          onCopySalarySheet={handleCopySalarySheet}
        />

        {/* Phần 2: Summary boxes */}
        <SalaryDetailSummary summary={summary} />

        {/* Phần 3: Table */}
        <SalaryDetailTable
          salaryDetails={filteredSalaryDetails}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
        />

        {/* Edit/Add Form */}
        <SalaryDetailEditForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSave={handleFormSave}
          salaryDetail={editingSalaryDetail}
          salarySheetId={salarySheetId!}
          month={salarySheet.month}
          year={salarySheet.year}
        />

        {/* Copy Dialog */}
        <CopySalarySheetDialog
          isOpen={showCopyDialog}
          onClose={() => setShowCopyDialog(false)}
          onSuccess={handleCopySuccess}
          salarySheetId={salarySheetId!}
        />
      </div>
    </AppLayout>
  );
};

export default SalaryDetailPage;
