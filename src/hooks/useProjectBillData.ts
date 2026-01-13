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

      // Calculate final_earn and storage_usdt for each team/year/month from team_report_details
      // Group by team-year-month first to calculate aggregated values
      const teamAggregates = new Map<string, { 
        final_bill: number; 
        final_pay: number; 
        storage_usdt: number;
      }>();

      teamReportDetails?.forEach((detail: any) => {
        const key = `${detail.team}-${detail.year}-${detail.month}`;
        if (teamAggregates.has(key)) {
          const existing = teamAggregates.get(key)!;
          existing.final_bill += (detail.converted_vnd || 0) + (detail.package_vnd || 0);
          existing.final_pay += (detail.total_payment || 0);
          existing.storage_usdt += (detail.storage_usdt || 0);
        } else {
          teamAggregates.set(key, {
            final_bill: (detail.converted_vnd || 0) + (detail.package_vnd || 0),
            final_pay: (detail.total_payment || 0),
            storage_usdt: (detail.storage_usdt || 0),
          });
        }
      });

      // Calculate final_earn for each team: Bill - Pay - Save (30% of Bill)
      const teamReportMap = new Map<string, { final_earn: number; storage_usdt: number }>();
      teamAggregates.forEach((values, key) => {
        const final_save = values.final_bill * 0.3;
        const final_earn = values.final_bill - values.final_pay - final_save;
        teamReportMap.set(key, {
          final_earn,
          storage_usdt: values.storage_usdt,
        });
      });

      // Group and aggregate data by project
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
          // earnVnd and earnUsdt are calculated per team/year/month, already set
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