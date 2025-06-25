
import { AppLayout } from '../components/layout/AppLayout';
import { ReportsFilters } from '../components/reports/ReportsFilters';
import { ReportsSummary } from '../components/reports/ReportsSummary';
import { ReportsTable } from '../components/reports/ReportsTable';
import { TeamFilters } from '../components/reports/TeamFilters';
import { TeamSummary } from '../components/reports/TeamSummary';
import { TeamTable } from '../components/reports/TeamTable';
import { TeamReportEditDialog } from '../components/reports/TeamReportEditDialog';
import { CreateTeamReportDialog } from '../components/reports/CreateTeamReportDialog';
import { CreateTeamDialog } from '../components/reports/CreateTeamDialog';
import { RevenueDetailDialog } from '../components/revenue/RevenueDetailDialog';
import { ExpenseDetailDialog } from '../components/expenses/ExpenseDetailDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReportsData } from '../hooks/useReportsData';
import { useReportsFilters } from '../hooks/useReportsFilters';
import { useTeamReportOperations } from '../hooks/useTeamReportOperations';
import { useRevenueExpenseOperations } from '../hooks/useRevenueExpenseOperations';

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

  const { handleFilter, handleTeamFilter } = useReportsFilters(
    revenues,
    expenses,
    teamReports,
    setFilteredRevenues,
    setFilteredExpenses,
    setFilteredTeamReports
  );

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue-expense">Thu Chi</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue-expense" className="space-y-6">
            {/* Filters */}
            <ReportsFilters onFilter={handleFilter} />

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
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            {/* Team Filters */}
            <TeamFilters 
              onFilter={handleTeamFilter}
              onCreateReport={handleCreateTeamReport}
              onCreateTeam={handleCreateTeam}
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
