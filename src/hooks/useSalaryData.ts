
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SalarySheet, SalaryFilters, SalarySummary } from '@/types/salary';

export const useSalaryData = () => {
  const [salarySheets, setSalarySheets] = useState<SalarySheet[]>([]);
  const [filteredSalarySheets, setFilteredSalarySheets] = useState<SalarySheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SalaryFilters>({
    months: [],
    years: []
  });
  const [summary, setSummary] = useState<SalarySummary>({
    total_net_salary: 0,
    total_personal_income_tax: 0,
    total_company_insurance: 0,
    total_personal_insurance: 0,
    total_payment: 0
  });

  const fetchSalarySheets = async () => {
    try {
      setLoading(true);
      
      // Fetch salary sheets
      const { data: sheetsData, error: sheetsError } = await supabase
        .from('salary_sheets')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (sheetsError) throw sheetsError;

      // For each salary sheet, calculate totals from salary_details
      const sheetsWithCalculatedTotals = await Promise.all(
        (sheetsData || []).map(async (sheet) => {
          const { data: detailsData, error: detailsError } = await supabase
            .from('salary_details')
            .select('*')
            .eq('salary_sheet_id', sheet.id);

          if (detailsError) {
            console.error('Error fetching details for sheet:', sheet.id, detailsError);
            return sheet;
          }

          // Calculate totals from details
          const totals = (detailsData || []).reduce(
            (acc, detail) => ({
              total_net_salary: acc.total_net_salary + detail.net_salary,
              total_personal_income_tax: acc.total_personal_income_tax + detail.total_personal_income_tax,
              total_company_insurance: acc.total_company_insurance + detail.total_bhdn,
              total_personal_insurance: acc.total_personal_insurance + detail.total_bhnld,
              total_payment: acc.total_payment + (detail.net_salary + detail.total_personal_income_tax + detail.total_bhdn + detail.total_bhnld)
            }),
            {
              total_net_salary: 0,
              total_personal_income_tax: 0,
              total_company_insurance: 0,
              total_personal_insurance: 0,
              total_payment: 0
            }
          );

          return {
            ...sheet,
            ...totals
          };
        })
      );

      setSalarySheets(sheetsWithCalculatedTotals);
    } catch (error) {
      console.error('Error fetching salary sheets:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bảng lương',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...salarySheets];

    if (filters.months.length > 0) {
      filtered = filtered.filter(sheet => filters.months.includes(sheet.month));
    }

    if (filters.years.length > 0) {
      filtered = filtered.filter(sheet => filters.years.includes(sheet.year));
    }

    setFilteredSalarySheets(filtered);

    // Calculate summary
    const newSummary = filtered.reduce(
      (acc, sheet) => ({
        total_net_salary: acc.total_net_salary + sheet.total_net_salary,
        total_personal_income_tax: acc.total_personal_income_tax + sheet.total_personal_income_tax,
        total_company_insurance: acc.total_company_insurance + sheet.total_company_insurance,
        total_personal_insurance: acc.total_personal_insurance + sheet.total_personal_insurance,
        total_payment: acc.total_payment + sheet.total_payment
      }),
      {
        total_net_salary: 0,
        total_personal_income_tax: 0,
        total_company_insurance: 0,
        total_personal_insurance: 0,
        total_payment: 0
      }
    );

    setSummary(newSummary);
  };

  useEffect(() => {
    fetchSalarySheets();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [salarySheets, filters]);

  return {
    salarySheets,
    filteredSalarySheets,
    loading,
    filters,
    setFilters,
    summary,
    fetchSalarySheets,
    handleSearch,
  };
};
