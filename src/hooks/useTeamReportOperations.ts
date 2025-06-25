
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTeamReportOperations = (fetchData: () => void) => {
  const [selectedTeamReport, setSelectedTeamReport] = useState<any>(null);
  const [showTeamEditDialog, setShowTeamEditDialog] = useState(false);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [showCreateTeamReportDialog, setShowCreateTeamReportDialog] = useState(false);

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

  return {
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
  };
};
