
import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { SalaryFilters } from '../components/salary/SalaryFilters';
import { SalarySummary } from '../components/salary/SalarySummary';
import { SalaryTable } from '../components/salary/SalaryTable';
import { CreateSalarySheetForm } from '../components/salary/CreateSalarySheetForm';
import { SalarySheet, SalaryFilters as SalaryFiltersType, SalarySummary as SalarySummaryType } from '@/types/salary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SalaryPage = () => {
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
      const { data, error } = await supabase
        .from('salary_sheets')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      
      setSalarySheets(data || []);
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
    toast({
      title: 'Chi tiết bảng lương',
      description: `Xem chi tiết bảng lương tháng ${salarySheet.month.toString().padStart(2, '0')}/${salarySheet.year}`,
    });
    // TODO: Navigate to salary detail page
  };

  const handleCreateSalarySheet = () => {
    setShowCreateForm(true);
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
