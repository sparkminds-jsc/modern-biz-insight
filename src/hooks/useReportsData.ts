
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useReportsData = () => {
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
      
      // Calculate final values from team_report_details for each team report
      const teamReportsWithCalculatedValues = await Promise.all(
        (teamReportsResult.data || []).map(async (report) => {
          const { data: details } = await supabase
            .from('team_report_details')
            .select('*')
            .eq('team', report.team)
            .eq('month', report.month)
            .eq('year', report.year);

          if (details && details.length > 0) {
            const final_bill = details.reduce((sum, item) => sum + (item.converted_vnd || 0), 0);
            const final_pay = details.reduce((sum, item) => sum + (item.total_payment || 0), 0);
            const final_save = details.reduce((sum, item) => sum + (item.converted_vnd || 0) + (item.package_vnd || 0) - (item.total_payment || 0), 0);
            const final_earn = details.reduce((sum, item) => sum + (item.converted_vnd || 0) + (item.package_vnd || 0), 0);
            const storage_usd = details.reduce((sum, item) => sum + (item.storage_usd || 0), 0);
            const storage_usdt = details.reduce((sum, item) => sum + (item.storage_usdt || 0), 0);

            return {
              ...report,
              final_bill,
              final_pay,
              final_save,
              final_earn,
              storage_usd,
              storage_usdt
            };
          }

          return report;
        })
      );
      
      setTeamReports(teamReportsWithCalculatedValues);
      setFilteredTeamReports(teamReportsWithCalculatedValues);
      
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

  return {
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
  };
};
