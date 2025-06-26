import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SalaryFilters } from '../components/salary/SalaryFilters';
import { SalarySummary } from '../components/salary/SalarySummary';
import { SalaryTable } from '../components/salary/SalaryTable';
import { CreateSalarySheetForm } from '../components/salary/CreateSalarySheetForm';
import { SalarySheet, SalaryFilters as SalaryFiltersType, SalarySummary as SalarySummaryType } from '@/types/salary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SalaryPage = () => {
  const navigate = useNavigate();
  const [salarySheets, setSalarySheets] = useState<SalarySheet[]>([]);
  const [filteredSalarySheets, setFilteredSalarySheets] = useState<SalarySheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SalaryFiltersType>({
    months: [],
    years: []
  });
  const [summary, setSummary] = useState<SalarySummaryType>({
    total_net_salary: 0,
    total_personal_income_tax: 0,
    total_company_insurance: 0,
    total_personal_insurance: 0,
    total_payment: 0
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchSalarySheets();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [salarySheets, filters]);

  const fetchSalarySheets = async () => {
    try {
      setLoading(true);
      
      // Fetch salary sheets
      const { data: sheetsData, error: sheetsError } = await supabase
        .from('salary_sheets')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (sheetsError) throw sheetsError;

      // For each salary sheet, calculate totals from salary_details
      const sheetsWithCalculatedTotals = await Promise.all(
        (sheetsData || []).map(async (sheet) => {
          const { data: detailsData, error: detailsError } = await supabase
            .from('salary_details')
            .select('*')
            .eq('salary_sheet_id', sheet.id);

          if (detailsError) {
            console.error('Error fetching details for sheet:', sheet.id, detailsError);
            return sheet;
          }

          // Calculate totals from details
          const totals = (detailsData || []).reduce(
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

          return {
            ...sheet,
            ...totals
          };
        })
      );

      setSalarySheets(sheetsWithCalculatedTotals);
    } catch (error) {
      console.error('Error fetching salary sheets:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bảng lương',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...salarySheets];

    if (filters.months.length > 0) {
      filtered = filtered.filter(sheet => filters.months.includes(sheet.month));
    }

    if (filters.years.length > 0) {
      filtered = filtered.filter(sheet => filters.years.includes(sheet.year));
    }

    setFilteredSalarySheets(filtered);

    // Calculate summary
    const newSummary = filtered.reduce(
      (acc, sheet) => ({
        total_net_salary: acc.total_net_salary + sheet.total_net_salary,
        total_personal_income_tax: acc.total_personal_income_tax + sheet.total_personal_income_tax,
        total_company_insurance: acc.total_company_insurance + sheet.total_company_insurance,
        total_personal_insurance: acc.total_personal_insurance + sheet.total_personal_insurance,
        total_payment: acc.total_payment + sheet.total_payment
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

  const handleViewDetails = (salarySheet: SalarySheet) => {
    navigate(`/salary/${salarySheet.id}`);
  };

  const handleCreateSalarySheet = () => {
    setShowCreateForm(true);
  };

  const handleCompleteSalarySheet = async (salarySheet: SalarySheet) => {
    try {
      const { error } = await supabase
        .from('salary_sheets')
        .update({ status: 'Hoàn thành' })
        .eq('id', salarySheet.id);

      if (error) throw error;

      // Create KPI record when salary sheet is completed
      const { error: kpiError } = await supabase
        .from('kpi_records')
        .insert({
          month: salarySheet.month,
          year: salarySheet.year,
          total_employees_with_kpi_gap: 0
        });

      if (kpiError) {
        console.error('Error creating KPI record:', kpiError);
        // Don't throw error as the main operation (completing salary sheet) succeeded
      }

      toast({
        title: 'Thành công',
        description: 'Đã hoàn thành bảng lương và tạo KPI tương ứng',
      });

      fetchSalarySheets();
    } catch (error) {
      console.error('Error completing salary sheet:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể hoàn thành bảng lương',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSalarySheet = async (salarySheet: SalarySheet) => {
    if (salarySheet.status === 'Hoàn thành') {
      toast({
        title: 'Không thể xóa',
        description: 'Không thể xóa bảng lương đã hoàn thành',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa bảng lương tháng ${salarySheet.month}/${salarySheet.year}?`)) {
      return;
    }

    try {
      // First delete salary details
      const { error: detailsError } = await supabase
        .from('salary_details')
        .delete()
        .eq('salary_sheet_id', salarySheet.id);

      if (detailsError) throw detailsError;

      // Then delete salary sheet
      const { error: sheetError } = await supabase
        .from('salary_sheets')
        .delete()
        .eq('id', salarySheet.id);

      if (sheetError) throw sheetError;

      toast({
        title: 'Thành công',
        description: 'Đã xóa bảng lương',
      });

      fetchSalarySheets();
    } catch (error) {
      console.error('Error deleting salary sheet:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bảng lương',
        variant: 'destructive',
      });
    }
  };

  const handleFormSave = () => {
    fetchSalarySheets();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lương</h1>
            <p className="text-gray-600">Tính toán và quản lý lương nhân viên</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lương</h1>
          <p className="text-gray-600">Tính toán và quản lý lương nhân viên</p>
        </div>

        {/* Phần 1: Filters */}
        <SalaryFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onCreateSalarySheet={handleCreateSalarySheet}
        />

        {/* Phần 2: Summary boxes */}
        <SalarySummary summary={summary} />

        {/* Phần 3: Table */}
        <SalaryTable
          salarySheets={filteredSalarySheets}
          onViewDetails={handleViewDetails}
          onComplete={handleCompleteSalarySheet}
          onDelete={handleDeleteSalarySheet}
        />

        {/* Create salary sheet form */}
        <CreateSalarySheetForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSave={handleFormSave}
          existingSalarySheets={salarySheets}
        />
      </div>
    </AppLayout>
  );
};

export default SalaryPage;
