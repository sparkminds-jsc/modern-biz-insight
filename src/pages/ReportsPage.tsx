import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ReportsPage = () => {
  const [revenues, setRevenues] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredRevenues, setFilteredRevenues] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  
  // Team reports state
  const [teamReports, setTeamReports] = useState<any[]>([]);
  const [filteredTeamReports, setFilteredTeamReports] = useState<any[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedRevenue, setSelectedRevenue] = useState<any>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [selectedTeamReport, setSelectedTeamReport] = useState<any>(null);
  const [showRevenueDetail, setShowRevenueDetail] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [showTeamEditDialog, setShowTeamEditDialog] = useState(false);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [showCreateTeamReportDialog, setShowCreateTeamReportDialog] = useState(false);

  const fetchData = async () => {
    try {
      const [revenueResult, expenseResult, teamReportsResult, teamsResult] = await Promise.all([
        supabase.from('revenue').select('*').order('created_date', { ascending: false }),
        supabase.from('expenses').select('*').order('created_date', { ascending: false }),
        supabase.from('team_reports').select('*').order('year', { ascending: false }).order('month', { ascending: false }),
        supabase.from('teams').select('name').order('name')
      ]);

      if (revenueResult.error) throw revenueResult.error;
      if (expenseResult.error) throw expenseResult.error;
      if (teamReportsResult.error) throw teamReportsResult.error;
      if (teamsResult.error) throw teamsResult.error;

      setRevenues(revenueResult.data || []);
      setExpenses(expenseResult.data || []);
      setFilteredRevenues(revenueResult.data || []);
      setFilteredExpenses(expenseResult.data || []);
      
      setTeamReports(teamReportsResult.data || []);
      setFilteredTeamReports(teamReportsResult.data || []);
      
      // Get teams from the teams table
      const teamNames = teamsResult.data?.map(team => team.name) || [];
      setTeams(teamNames);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Combine revenue and expense data for the table
    const revenueItems = filteredRevenues.map(item => ({
      ...item,
      type: 'revenue',
      category: item.revenue_type,
      wallet_type: item.wallet_type
    }));

    const expenseItems = filteredExpenses.map(item => ({
      ...item,
      type: 'expense',
      category: item.expense_type,
      wallet_type: item.wallet_type
    }));

    const combined = [...revenueItems, ...expenseItems].sort((a, b) => 
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );

    setCombinedData(combined);
  }, [filteredRevenues, filteredExpenses]);

  const handleFilter = (filters: any) => {
    let filteredRevenue = [...revenues];
    let filteredExpense = [...expenses];

    if (filters.startDate) {
      filteredRevenue = filteredRevenue.filter(item => 
        new Date(item.created_date) >= filters.startDate
      );
      filteredExpense = filteredExpense.filter(item => 
        new Date(item.created_date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      filteredRevenue = filteredRevenue.filter(item => 
        new Date(item.created_date) <= filters.endDate
      );
      filteredExpense = filteredExpense.filter(item => 
        new Date(item.created_date) <= filters.endDate
      );
    }

    if (filters.walletType) {
      filteredRevenue = filteredRevenue.filter(item => 
        item.wallet_type === filters.walletType
      );
      filteredExpense = filteredExpense.filter(item => 
        item.wallet_type === filters.walletType
      );
    }

    setFilteredRevenues(filteredRevenue);
    setFilteredExpenses(filteredExpense);
  };

  const handleTeamFilter = (filters: any) => {
    let filtered = [...teamReports];

    if (filters.months.length > 0) {
      filtered = filtered.filter(item => filters.months.includes(item.month));
    }

    if (filters.years.length > 0) {
      filtered = filtered.filter(item => filters.years.includes(item.year));
    }

    if (filters.team) {
      filtered = filtered.filter(item => item.team === filters.team);
    }

    setFilteredTeamReports(filtered);
  };

  const handleViewRevenue = (revenue: any) => {
    setSelectedRevenue(revenue);
    setShowRevenueDetail(true);
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowExpenseDetail(true);
  };

  const handleViewTeamDetail = (report: any) => {
    // TODO: Navigate to detailed team report page
    console.log('View team detail:', report);
    toast.info('Màn hình báo cáo chi tiết đang được phát triển');
  };

  const handleEditTeamReport = (report: any) => {
    setSelectedTeamReport(report);
    setShowTeamEditDialog(true);
  };

  const handleDeleteTeamReport = async (report: any) => {
    try {
      const { error } = await supabase
        .from('team_reports')
        .delete()
        .eq('id', report.id);

      if (error) throw error;

      toast.success('Xóa báo cáo thành công');
      fetchData();
    } catch (error) {
      console.error('Error deleting team report:', error);
      toast.error('Có lỗi xảy ra khi xóa báo cáo');
    }
  };

  const handleCreateTeamReport = () => {
    setShowCreateTeamReportDialog(true);
  };

  const handleCreateTeam = () => {
    setShowCreateTeamDialog(true);
  };

  const handleTeamReportSaved = () => {
    fetchData();
  };

  const handleTeamCreated = () => {
    fetchData();
  };

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
