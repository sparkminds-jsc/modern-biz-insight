
export const useReportsFilters = (
  revenues: any[],
  expenses: any[],
  teamReports: any[],
  setFilteredRevenues: (data: any[]) => void,
  setFilteredExpenses: (data: any[]) => void,
  setFilteredTeamReports: (data: any[]) => void
) => {
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

    if (filters.content) {
      const contentLower = filters.content.toLowerCase();
      filteredRevenue = filteredRevenue.filter(item =>
        item.content?.toLowerCase().includes(contentLower)
      );
      filteredExpense = filteredExpense.filter(item =>
        item.content?.toLowerCase().includes(contentLower)
      );
    }

    if (filters.selectedTypes && filters.selectedTypes.length > 0) {
      filteredRevenue = filteredRevenue.filter(item =>
        filters.selectedTypes.includes(item.revenue_type)
      );
      filteredExpense = filteredExpense.filter(item =>
        filters.selectedTypes.includes(item.expense_type)
      );
    }

    setFilteredRevenues(filteredRevenue);
    setFilteredExpenses(filteredExpense);
  };

  const handleTeamFilter = async (filters: any) => {
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

  return {
    handleFilter,
    handleTeamFilter
  };
};
