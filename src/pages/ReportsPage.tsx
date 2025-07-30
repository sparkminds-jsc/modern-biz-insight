
import { AppLayout } from '../components/layout/AppLayout';
import { ReportsFilters } from '../components/reports/ReportsFilters';
import { ReportsSummary } from '../components/reports/ReportsSummary';
import { ReportsTable } from '../components/reports/ReportsTable';
import { RevenueExpenseChart } from '../components/reports/RevenueExpenseChart';
import { TeamFilters } from '../components/reports/TeamFilters';
import { TeamSummary } from '../components/reports/TeamSummary';
import { TeamTable } from '../components/reports/TeamTable';
import TeamChart from '../components/reports/TeamChart';
import { TeamReportEditDialog } from '../components/reports/TeamReportEditDialog';
import { CreateTeamReportDialog } from '../components/reports/CreateTeamReportDialog';
import { CreateTeamDialog } from '../components/reports/CreateTeamDialog';
import { RevenueDetailDialog } from '../components/revenue/RevenueDetailDialog';
import { ExpenseDetailDialog } from '../components/expenses/ExpenseDetailDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useReportsData } from '../hooks/useReportsData';
import { useReportsFilters } from '../hooks/useReportsFilters';
import { useTeamReportOperations } from '../hooks/useTeamReportOperations';
import { useRevenueExpenseOperations } from '../hooks/useRevenueExpenseOperations';
import { useProjectBillData } from '../hooks/useProjectBillData';
import { ProjectBillFilters } from '../components/reports/ProjectBillFilters';
import { ProjectBillSummary } from '../components/reports/ProjectBillSummary';
import { ProjectBillTable } from '../components/reports/ProjectBillTable';
import { exportTeamReportToPDF } from '../utils/pdfExport';
import { exportTeamReportsToCSV } from '../utils/excelExport';
import { toast } from 'sonner';

const ReportsPage = () => {
  const {
    revenues,
    expenses,
    filteredRevenues,
    filteredExpenses,
    combinedData,
    teamReports,
    filteredTeamReports,
    teams,
    loading,
    fetchData,
    setFilteredRevenues,
    setFilteredExpenses,
    setFilteredTeamReports
  } = useReportsData();

  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [currentTeamFilters, setCurrentTeamFilters] = useState<any>({});

  const { handleFilter, handleTeamFilter } = useReportsFilters(
    revenues,
    expenses,
    teamReports,
    setFilteredRevenues,
    setFilteredExpenses,
    setFilteredTeamReports
  );

  const handleReportsFilter = (filters: any) => {
    setCurrentFilters(filters);
    handleFilter(filters);
  };

  const handleTeamFilterChange = (months: number[], years: number[]) => {
    setSelectedMonths(months);
    setSelectedYears(years);
  };

  const handleTeamFilterWithStorage = (filters: any) => {
    setCurrentTeamFilters(filters);
    handleTeamFilter(filters);
  };

  const handleExportPDF = () => {
    exportTeamReportToPDF({
      teamData: filteredTeamReports,
      filters: currentTeamFilters
    });
  };

  const handleExportCSV = () => {
    if (filteredTeamReports.length === 0) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    try {
      exportTeamReportsToCSV({
        teamData: filteredTeamReports,
        filters: currentTeamFilters
      });
      toast.success('Xuất CSV thành công');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Có lỗi xảy ra khi xuất CSV');
    }
  };

  const {
    selectedTeamReport,
    showTeamEditDialog,
    showCreateTeamDialog,
    showCreateTeamReportDialog,
    setShowTeamEditDialog,
    setShowCreateTeamDialog,
    setShowCreateTeamReportDialog,
    handleViewTeamDetail,
    handleEditTeamReport,
    handleDeleteTeamReport,
    handleCreateTeamReport,
    handleCreateTeam,
    handleTeamReportSaved,
    handleTeamCreated
  } = useTeamReportOperations(fetchData);

  const {
    selectedRevenue,
    selectedExpense,
    showRevenueDetail,
    showExpenseDetail,
    setShowRevenueDetail,
    setShowExpenseDetail,
    handleViewRevenue,
    handleViewExpense
  } = useRevenueExpenseOperations();

  const {
    filteredData: projectBillData,
    loading: projectBillLoading,
    handleFilter: handleProjectBillFilter
  } = useProjectBillData();

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý báo cáo</h1>
          <p className="text-gray-600">Báo cáo thu chi và hiệu suất team</p>
        </div>

        <Tabs defaultValue="revenue-expense" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue-expense">Thu Chi</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="project-bills">Bill Dự Án</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue-expense" className="space-y-6">
            {/* Filters */}
            <ReportsFilters onFilter={handleReportsFilter} />

            {/* Summary */}
            <ReportsSummary 
              revenueData={filteredRevenues} 
              expenseData={filteredExpenses}
            />

            {/* Table */}
            <ReportsTable 
              data={combinedData}
              onViewRevenue={handleViewRevenue}
              onViewExpense={handleViewExpense}
            />

            {/* Chart */}
            <RevenueExpenseChart
              revenueData={filteredRevenues}
              expenseData={filteredExpenses}
              startDate={currentFilters.startDate}
              endDate={currentFilters.endDate}
            />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            {/* Team Filters */}
            <TeamFilters 
              onFilter={handleTeamFilterWithStorage}
              onFilterChange={handleTeamFilterChange}
              onCreateReport={handleCreateTeamReport}
              onCreateTeam={handleCreateTeam}
              onExportCSV={handleExportCSV}
              teams={teams}
            />

            {/* Team Summary */}
            <TeamSummary teamData={filteredTeamReports} />

            {/* Team Table */}
            <TeamTable 
              data={filteredTeamReports}
              onViewDetail={handleViewTeamDetail}
              onEdit={handleEditTeamReport}
              onDelete={handleDeleteTeamReport}
            />

            {/* Team Chart */}
            <TeamChart
              teamReports={filteredTeamReports}
              selectedMonths={selectedMonths}
              selectedYears={selectedYears}
            />
          </TabsContent>
          
          <TabsContent value="project-bills" className="space-y-6">
            {/* Project Bill Filters */}
            <ProjectBillFilters onFilter={handleProjectBillFilter} />

            {/* Project Bill Summary */}
            <ProjectBillSummary data={projectBillData} />

            {/* Project Bill Table */}
            <ProjectBillTable data={projectBillData} />
          </TabsContent>
        </Tabs>

        {/* Detail Dialogs */}
        <RevenueDetailDialog
          open={showRevenueDetail}
          onClose={() => setShowRevenueDetail(false)}
          revenue={selectedRevenue}
        />

        <ExpenseDetailDialog
          open={showExpenseDetail}
          onClose={() => setShowExpenseDetail(false)}
          expense={selectedExpense}
        />

        <TeamReportEditDialog
          open={showTeamEditDialog}
          onClose={() => setShowTeamEditDialog(false)}
          report={selectedTeamReport}
          onSave={handleTeamReportSaved}
        />

        <CreateTeamReportDialog
          open={showCreateTeamReportDialog}
          onClose={() => setShowCreateTeamReportDialog(false)}
          teams={teams}
          onSave={handleTeamReportSaved}
        />

        <CreateTeamDialog
          open={showCreateTeamDialog}
          onClose={() => setShowCreateTeamDialog(false)}
          onSave={handleTeamCreated}
        />
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
