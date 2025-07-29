
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KPIDetail, KPIDetailData } from '@/types/kpiDetail';

export const transformKPIDetailData = (detail: KPIDetail): KPIDetailData => ({
  id: detail.id,
  employeeCode: detail.employee_code,
  hasKPIGap: detail.has_kpi_gap,
  basicSalary: detail.basic_salary,
  kpi: detail.kpi,
  totalSalary: detail.total_salary,
  salaryCoefficient: detail.salary_coefficient,
  kpiCoefficient: detail.kpi_coefficient,
  totalMonthlyKPI: detail.total_monthly_kpi,
  isLocked: detail.is_locked,
  workProductivity: {
    total: detail.work_productivity?.total || 0,
    completedOnTime: detail.work_productivity?.completedOnTime || 0,
    overdueTask: detail.work_productivity?.overdueTask || 0,
    taskTarget: detail.work_productivity?.taskTarget || 0,
    locTarget: detail.work_productivity?.locTarget || 0,
    lotTarget: detail.work_productivity?.lotTarget || 0,
    effortRatio: detail.work_productivity?.effortRatio || 0,
    gitActivity: detail.work_productivity?.gitActivity || 0,
  },
  workQuality: {
    total: detail.work_quality?.total || 0,
    prodBugs: detail.work_quality?.prodBugs || 0,
    testBugs: detail.work_quality?.testBugs || 0,
    mergeRatio: detail.work_quality?.mergeRatio || 0,
  },
  attitude: {
    total: detail.attitude?.total || 0,
    positiveAttitude: detail.attitude?.positiveAttitude || 0,
    techSharing: detail.attitude?.techSharing || 0,
    techArticles: detail.attitude?.techArticles || 0,
    mentoring: detail.attitude?.mentoring || 0,
    teamManagement: detail.attitude?.teamManagement || 0,
  },
  progress: {
    total: detail.progress?.total || 0,
    onTimeCompletion: detail.progress?.onTimeCompletion || 0,
    storyPointAccuracy: detail.progress?.storyPointAccuracy || 0,
    planChanges: detail.progress?.planChanges || 0,
  },
  requirements: {
    total: detail.requirements?.total || 0,
    changeRequests: detail.requirements?.changeRequests || 0,
    misunderstandingErrors: detail.requirements?.misunderstandingErrors || 0,
  },
  recruitment: {
    total: detail.recruitment?.total || 0,
    cvCount: detail.recruitment?.cvCount || 0,
    passedCandidates: detail.recruitment?.passedCandidates || 0,
    recruitmentCost: detail.recruitment?.recruitmentCost || 0,
  },
  revenue: {
    clientsOver100M: detail.revenue?.clientsOver100M || 0,
  },
});

export const useKPIDetailData = (year?: string, month?: string) => {
  const [kpiDetails, setKpiDetails] = useState<KPIDetail[]>([]);
  const [filteredData, setFilteredData] = useState<KPIDetailData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKPIDetails = async () => {
    if (!year || !month) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kpi_details')
        .select('*')
        .eq('year', parseInt(year))
        .eq('month', parseInt(month))
        .order('employee_code');

      if (error) throw error;
      
      setKpiDetails(data || []);
      const transformedData = (data || []).map(transformKPIDetailData);
      setFilteredData(transformedData);

      // Update the KPI record count to match actual data
      await updateKPIRecordCount(data || []);
    } catch (error) {
      console.error('Error fetching KPI details:', error);
      toast.error('Không thể tải dữ liệu KPI chi tiết');
    } finally {
      setLoading(false);
    }
  };

  const updateKPIRecordCount = async (kpiDetailsData: KPIDetail[]) => {
    if (!year || !month) return;
    
    try {
      const kpiGapCount = kpiDetailsData.filter(item => item.has_kpi_gap).length;
      
      const { error } = await supabase
        .from('kpi_records')
        .update({ total_employees_with_kpi_gap: kpiGapCount })
        .eq('year', parseInt(year))
        .eq('month', parseInt(month));

      if (error) throw error;
    } catch (error) {
      console.error('Error updating KPI record count:', error);
    }
  };

  useEffect(() => {
    fetchKPIDetails();
  }, [year, month]);

  return {
    kpiDetails,
    filteredData,
    setFilteredData,
    loading,
    fetchKPIDetails
  };
};
