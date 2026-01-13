import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectBillData {
  projectName: string;
  year: number;
  month: number;
  team: string;
  billVnd: number;
  billUsd: number;
  billUsdt: number;
  earnVnd: number;
  earnUsdt: number;
}

interface ProjectBillFilters {
  projectId?: string;
  months: number[];
  years: number[];
  team?: string;
  exchangeRate?: number;
}

export function useProjectBillData() {
  const [data, setData] = useState<ProjectBillData[]>([]);
  const [filteredData, setFilteredData] = useState<ProjectBillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(25000);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects for filtering
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name');
      
      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
      
      // Fetch team report details with project information
      const { data: teamReportDetails, error } = await supabase
        .from('team_report_details')
        .select(`
          *,
          projects:project_id (
            id,
            name
          )
        `);

      if (error) throw error;

      // Fetch team reports to get final_earn and storage_usdt
      const { data: teamReports, error: teamReportsError } = await supabase
        .from('team_reports')
        .select('team, year, month, final_earn, storage_usdt');

      if (teamReportsError) throw teamReportsError;

      // Create a map of team reports for quick lookup
      const teamReportMap = new Map<string, { final_earn: number; storage_usdt: number }>();
      teamReports?.forEach((report: any) => {
        const key = `${report.team}-${report.year}-${report.month}`;
        teamReportMap.set(key, {
          final_earn: report.final_earn || 0,
          storage_usdt: report.storage_usdt || 0,
        });
      });

      // Group and aggregate data
      const groupedData = new Map<string, ProjectBillData>();

      teamReportDetails?.forEach((detail: any) => {
        const projectName = detail.projects?.name || 'Không có dự án';
        const key = `${projectName}-${detail.year}-${detail.month}-${detail.team}`;
        const teamReportKey = `${detail.team}-${detail.year}-${detail.month}`;
        const teamReportData = teamReportMap.get(teamReportKey);
        
        if (groupedData.has(key)) {
          const existing = groupedData.get(key)!;
          existing.billVnd += (detail.converted_vnd || 0) + (detail.package_vnd || 0);
          existing.billUsd += (detail.storage_usd || 0) * 10 / 7;
          existing.billUsdt += (detail.storage_usdt || 0) * 10 / 7;
          // earnVnd and earnUsdt are from team_reports, already set
        } else {
          groupedData.set(key, {
            projectName,
            year: detail.year,
            month: detail.month,
            team: detail.team,
            billVnd: (detail.converted_vnd || 0) + (detail.package_vnd || 0),
            billUsd: (detail.storage_usd || 0) * 10 / 7,
            billUsdt: (detail.storage_usdt || 0) * 10 / 7,
            earnVnd: teamReportData?.final_earn || 0,
            earnUsdt: (teamReportData?.storage_usdt || 0) * 0.7,
          });
        }
      });

      const aggregatedData = Array.from(groupedData.values());
      setData(aggregatedData);
      setFilteredData(aggregatedData);
    } catch (error) {
      console.error('Error fetching project bill data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: ProjectBillFilters) => {
    let filtered = [...data];

    // Store selected months and years
    setSelectedMonths(filters.months);
    setSelectedYears(filters.years);

    // Filter by project
    if (filters.projectId) {
      const selectedProject = projects.find(p => p.id === filters.projectId);
      if (selectedProject) {
        filtered = filtered.filter(item => item.projectName === selectedProject.name);
      }
    }

    // Filter by months
    if (filters.months.length > 0) {
      filtered = filtered.filter(item => filters.months.includes(item.month));
    }

    // Filter by years
    if (filters.years.length > 0) {
      filtered = filtered.filter(item => filters.years.includes(item.year));
    }

    // Filter by team
    if (filters.team) {
      filtered = filtered.filter(item => item.team === filters.team);
    }

    // Set exchange rate if provided
    if (filters.exchangeRate) {
      setExchangeRate(filters.exchangeRate);
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    filteredData,
    loading,
    fetchData,
    handleFilter,
    exchangeRate,
    projects,
    selectedMonths,
    selectedYears,
  };
}