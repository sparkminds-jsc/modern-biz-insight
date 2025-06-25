import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { TeamReportDetailFilters } from '../components/reports/TeamReportDetailFilters';
import { TeamReportDetailSummary } from '../components/reports/TeamReportDetailSummary';
import { TeamReportDetailTable } from '../components/reports/TeamReportDetailTable';
import { TeamReportDetailEditDialog } from '../components/reports/TeamReportDetailEditDialog';
import { CreateTeamReportDetailDialog } from '../components/reports/CreateTeamReportDetailDialog';
import { CopyTeamReportDialog } from '../components/reports/CopyTeamReportDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TeamReportDetailPage = () => {
  const { teamReportId } = useParams();
  const navigate = useNavigate();
  
  // State for team report
  const [teamReport, setTeamReport] = useState<any>(null);
  const [reportDetails, setReportDetails] = useState<any[]>([]);
  const [filteredDetails, setFilteredDetails] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  // Dialog states
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!teamReportId) return;
    
    try {
      // Fetch team report
      const { data: teamReportData, error: teamReportError } = await supabase
        .from('team_reports')
        .select('*')
        .eq('id', teamReportId)
        .single();

      if (teamReportError) throw teamReportError;
      setTeamReport(teamReportData);

      // Fetch report details
      const { data: detailsData, error: detailsError } = await supabase
        .from('team_report_details')
        .select('*')
        .eq('team', teamReportData.team)
        .eq('month', teamReportData.month)
        .eq('year', teamReportData.year)
        .order('employee_code');

      if (detailsError) throw detailsError;
      setReportDetails(detailsData || []);
      setFilteredDetails(detailsData || []);

      // Fetch employees of the same team
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('team', teamReportData.team)
        .order('employee_code');

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teamReportId]);

  const handleFilter = (employeeCode?: string) => {
    let filtered = [...reportDetails];
    
    if (employeeCode && employeeCode !== 'all') {
      filtered = filtered.filter(item => item.employee_code === employeeCode);
    }
    
    setFilteredDetails(filtered);
  };

  const handleEdit = (detail: any) => {
    setSelectedDetail(detail);
    setShowEditDialog(true);
  };

  const handleDelete = async (detail: any) => {
    if (!confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) return;
    
    try {
      const { error } = await supabase
        .from('team_report_details')
        .delete()
        .eq('id', detail.id);

      if (error) throw error;
      
      toast.success('Xóa thành công');
      fetchData();
    } catch (error) {
      console.error('Error deleting report detail:', error);
      toast.error('Có lỗi xảy ra khi xóa');
    }
  };

  const handleSaved = () => {
    fetchData();
  };

  const handleCopyReport = async (month: number, year: number) => {
    try {
      console.log('Starting copy report for:', { month, year, team: teamReport.team });
      
      // Check if team report already exists for the target month/year
      const { data: existingReport, error: checkError } = await supabase
        .from('team_reports')
        .select('id')
        .eq('team', teamReport.team)
        .eq('month', month)
        .eq('year', year)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let targetTeamReportId;

      if (existingReport) {
        // Use existing team report
        targetTeamReportId = existingReport.id;
        console.log('Using existing team report:', targetTeamReportId);
      } else {
        // Create new team report
        const { data: newTeamReport, error: createError } = await supabase
          .from('team_reports')
          .insert({
            team: teamReport.team,
            month: month,
            year: year,
            final_bill: 0,
            final_pay: 0,
            final_save: 0,
            final_earn: 0,
            storage_usd: 0,
            storage_usdt: 0,
            notes: null
          })
          .select()
          .single();

        if (createError) throw createError;
        targetTeamReportId = newTeamReport.id;
        console.log('Created new team report:', targetTeamReportId);
      }

      // Copy all current report details to new month/year
      if (reportDetails.length > 0) {
        const detailsToInsert = reportDetails.map(detail => ({
          employee_code: detail.employee_code,
          employee_name: detail.employee_name,
          team: detail.team,
          month: month,
          year: year,
          billable_hours: detail.billable_hours,
          rate: detail.rate,
          fx_rate: detail.fx_rate,
          percentage: detail.percentage,
          package_vnd: detail.package_vnd,
          has_salary: detail.has_salary,
          company_payment: detail.company_payment,
          salary_13: detail.salary_13,
          storage_usd: detail.storage_usd,
          storage_usdt: detail.storage_usdt,
          notes: detail.notes
        }));

        console.log('Copying details:', detailsToInsert.length);

        const { error: insertError } = await supabase
          .from('team_report_details')
          .insert(detailsToInsert);

        if (insertError) throw insertError;
      }
      
      toast.success('Copy báo cáo thành công');
      navigate('/reports');
    } catch (error) {
      console.error('Error copying report:', error);
      toast.error('Có lỗi xảy ra khi copy báo cáo');
    }
  };

  const handleBackToReports = () => {
    navigate('/reports');
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

  if (!teamReport) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Không tìm thấy báo cáo</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back button positioned at the top left */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBackToReports}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Báo cáo chi tiết - {teamReport.team} ({teamReport.month}/{teamReport.year})
          </h1>
          <p className="text-gray-600">Chi tiết báo cáo từng nhân viên</p>
        </div>

        {/* Filters */}
        <TeamReportDetailFilters
          employees={employees}
          onFilter={handleFilter}
          onCreateBill={() => setShowCreateDialog(true)}
          onCopyReport={() => setShowCopyDialog(true)}
        />

        {/* Summary */}
        <TeamReportDetailSummary reportDetails={filteredDetails} />

        {/* Table */}
        <TeamReportDetailTable
          data={filteredDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Dialogs */}
        <TeamReportDetailEditDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          detail={selectedDetail}
          employees={employees}
          teamReport={teamReport}
          onSave={handleSaved}
        />

        <CreateTeamReportDetailDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          employees={employees}
          teamReport={teamReport}
          onSave={handleSaved}
        />

        <CopyTeamReportDialog
          open={showCopyDialog}
          onClose={() => setShowCopyDialog(false)}
          onCopy={handleCopyReport}
        />
      </div>
    </AppLayout>
  );
};

export default TeamReportDetailPage;
