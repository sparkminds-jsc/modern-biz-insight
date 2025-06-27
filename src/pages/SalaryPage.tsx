import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SalaryFilters } from '../components/salary/SalaryFilters';
import { SalarySummary } from '../components/salary/SalarySummary';
import { SalaryTable } from '../components/salary/SalaryTable';
import { CreateSalarySheetForm } from '../components/salary/CreateSalarySheetForm';
import { SalarySheet } from '@/types/salary';
import { useSalaryData } from '@/hooks/useSalaryData';
import { useSalaryOperations } from '@/hooks/useSalaryOperations';

const SalaryPage = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
    salarySheets,
    filteredSalarySheets,
    loading,
    filters,
    setFilters,
    summary,
    fetchSalarySheets,
    handleSearch,
  } = useSalaryData();

  const {
    loading: operationLoading,
    completeSalarySheet,
    sendSalaryMail,
    deleteSalarySheet,
  } = useSalaryOperations();

  const handleViewDetails = (salarySheet: SalarySheet) => {
    navigate(`/salary/${salarySheet.id}`);
  };

  const handleCreateSalarySheet = () => {
    setShowCreateForm(true);
  };

  const handleCompleteSalarySheet = async (salarySheet: SalarySheet) => {
    const success = await completeSalarySheet(salarySheet);
    if (success) {
      fetchSalarySheets();
    }
  };

  const handleSendMail = async (salarySheet: SalarySheet) => {
    const success = await sendSalaryMail(salarySheet);
    if (success) {
      // Refresh data to update button states immediately
      fetchSalarySheets();
    }
  };

  const handleDeleteSalarySheet = async (salarySheet: SalarySheet) => {
    const success = await deleteSalarySheet(salarySheet);
    if (success) {
      fetchSalarySheets();
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
          onSendMail={handleSendMail}
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
