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
}

interface ProjectBillFilters {
  projectId?: string;
  months: number[];
  years: number[];
  team?: string;
}

export function useProjectBillData() {
  const [data, setData] = useState<ProjectBillData[]>([]);
  const [filteredData, setFilteredData] = useState<ProjectBillData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
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

      // Group and aggregate data
      const groupedData = new Map<string, ProjectBillData>();

      teamReportDetails?.forEach((detail: any) => {
        const projectName = detail.projects?.name || 'Không có dự án';
        const key = `${projectName}-${detail.year}-${detail.month}-${detail.team}`;
        
        if (groupedData.has(key)) {
          const existing = groupedData.get(key)!;
          existing.billVnd += (detail.converted_vnd || 0) + (detail.package_vnd || 0);
          existing.billUsd += detail.storage_usd || 0;
          existing.billUsdt += detail.storage_usdt || 0;
        } else {
          groupedData.set(key, {
            projectName,
            year: detail.year,
            month: detail.month,
            team: detail.team,
            billVnd: (detail.converted_vnd || 0) + (detail.package_vnd || 0),
            billUsd: detail.storage_usd || 0,
            billUsdt: detail.storage_usdt || 0,
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

    // Filter by project
    if (filters.projectId) {
      // We need to get the project name from the project ID
      filtered = filtered.filter(item => {
        // This is a simplified approach - in a real scenario, you'd want to 
        // maintain a project ID to name mapping
        return true; // For now, we'll implement this logic in the component
      });
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
  };
}