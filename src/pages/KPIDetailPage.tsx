
import { useParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { KPIDetailFilters } from '../components/kpi/KPIDetailFilters';
import { KPIDetailSummary } from '../components/kpi/KPIDetailSummary';
import { KPIDetailTable } from '../components/kpi/KPIDetailTable';
import { KPIDetailDialogs } from '../components/kpi/KPIDetailDialogs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useKPIDetailData } from '../hooks/useKPIDetailData';
import { useKPIDetailFilters } from '../hooks/useKPIDetailFilters';
import { useKPIDetailOperations } from '../hooks/useKPIDetailOperations';

const KPIDetailPage = () => {
  const { year, month } = useParams();
  
  // Data hook
  const { kpiDetails, loading, fetchKPIDetails } = useKPIDetailData(year, month);
  
  // Filters hook
  const {
    employeeCode,
    setEmployeeCode,
    employeeName,
    setEmployeeName,
    hasKPIGap,
    setHasKPIGap,
    filteredData,
    handleSearch
  } = useKPIDetailFilters(kpiDetails);

  // Operations hook
  const {
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
    handleDeleteConfirm,
    handleToggleLock
  } = useKPIDetailOperations(kpiDetails, year, month, fetchKPIDetails);

  const totalEmployeesWithKPIGap = filteredData.filter(item => item.hasKPIGap).length;

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
            onClick={() => handleDownloadExcel(filteredData)}
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
          onDelete={(id) => handleDelete(id, filteredData)}
          onToggleLock={handleToggleLock}
        />
        )}

        {/* All Dialogs */}
        <KPIDetailDialogs
          showEditForm={showEditForm}
          onCloseEditForm={() => setShowEditForm(false)}
          onSave={handleFormSave}
          editingKPIDetail={editingKPIDetail}
          month={parseInt(month || '1')}
          year={parseInt(year || '2024')}
          showCopyDialog={showCopyDialog}
          onCloseCopyDialog={() => setShowCopyDialog(false)}
          onCopyConfirm={handleCopyConfirm}
          showSalaryIncompleteDialog={showSalaryIncompleteDialog}
          onCloseSalaryIncompleteDialog={() => setShowSalaryIncompleteDialog(false)}
          showDeleteDialog={showDeleteDialog}
          onCloseDeleteDialog={() => setShowDeleteDialog(false)}
          deletingKPIDetail={deletingKPIDetail}
          onDeleteConfirm={handleDeleteConfirm}
        />
      </div>
    </AppLayout>
  );
};

export default KPIDetailPage;
