
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormData, SalaryData, CalculatedValues } from './kpiFormTypes';

export const useKPICalculations = (
  watchedValues: FormData,
  month: number,
  year: number
) => {
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    basicSalary: 0,
    kpi: 0,
    totalSalary: 0,
    salaryCoefficient: 0,
    kpiCoefficient: 0,
    totalMonthlyKPI: 0,
    hasKPIGap: false,
    workProductivityTotal: 0,
    workQualityTotal: 0,
    pullRequestMergeRatio: 0,
    attitudeTotal: 0,
    progressTotal: 0,
    requirementsTotal: 0,
    recruitmentTotal: 0
  });

  const fetchSalaryData = async (employeeCode: string) => {
    try {
      // First get salary sheet for the month/year
      const { data: salarySheet, error: sheetError } = await supabase
        .from('salary_sheets')
        .select('id')
        .eq('month', month)
        .eq('year', year)
        .single();

      if (sheetError || !salarySheet) {
        console.log('No salary sheet found for this month/year');
        setSalaryData(null);
        return;
      }

      // Then get salary detail for this employee
      const { data: salaryDetail, error: detailError } = await supabase
        .from('salary_details')
        .select('gross_salary, kpi_bonus, overtime_1_5, overtime_2, overtime_3')
        .eq('salary_sheet_id', salarySheet.id)
        .eq('employee_code', employeeCode)
        .single();

      if (detailError || !salaryDetail) {
        console.log('No salary detail found for this employee');
        setSalaryData(null);
        return;
      }

      setSalaryData(salaryDetail);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setSalaryData(null);
    }
  };

  const calculateValues = () => {
    const values = watchedValues;
    
    // Basic salary and KPI from salary data
    const basicSalary = salaryData?.gross_salary || 0;
    const kpi = salaryData ? (salaryData.kpi_bonus + salaryData.overtime_1_5 + salaryData.overtime_2 + salaryData.overtime_3) : 0;
    const totalSalary = basicSalary + kpi;
    const salaryCoefficient = basicSalary !== 0 ? parseFloat((kpi / basicSalary).toFixed(3)) : 0;

    // Work productivity total calculation
    const workProductivityTotal = 
      parseFloat(values.completedOnTime) - (values.overdueTask * 0.01) + 
      parseFloat(values.taskTarget) + 
      parseFloat(values.effortRatio) + 
      parseFloat(values.gitActivity);

    // Work quality total calculation
    const workQualityTotal = Math.max(0, 100 - values.prodBugs * 5 - values.testBugs * 2);

    // Pull request merge ratio
    const pullRequestMergeRatio = values.mergeRatio;

    // Attitude total calculation
    const attitudeTotal = 
      values.positiveAttitude + values.techContribution + values.techSharing * 5 + 
      values.techArticles * 3 + values.mentoring * 2 + values.teamManagement * 3;

    // Progress total calculation
    const progressTotal = 
      values.onTimeCompletion + values.storyPointAccuracy - values.planChanges * 2;

    // Requirements total calculation
    const requirementsTotal = 
      Math.max(0, 100 - values.changeRequests * 5 - values.misunderstandingErrors * 10);

    // Recruitment total calculation
    const recruitmentTotal = 
      values.cvCount * 0.5 + values.passedCandidates * 2 + 
      Math.max(0, (2000000 - values.recruitmentCost) / 10000);

    // KPI coefficient calculation
    const kpiCoefficient = 
      workProductivityTotal + workQualityTotal + attitudeTotal + 
      progressTotal + requirementsTotal + recruitmentTotal;

    // Total monthly KPI calculation
    const totalMonthlyKPI = 
      (basicSalary * kpiCoefficient / 100) + 
      (100000 * values.mentoring) + 
      (values.teamManagement * 2000000) + 
      (values.clientsOver100M * 4000000) + 
      values.locTarget + values.lotTarget + 
      (values.passedCandidates * 500000) + 
      Math.max(0, values.recruitmentCost - 2000000);

    // Check if there's KPI gap
    const hasKPIGap = Math.abs(kpi - totalMonthlyKPI) > 1000; // Allow small rounding differences

    setCalculatedValues({
      basicSalary,
      kpi,
      totalSalary,
      salaryCoefficient,
      kpiCoefficient: parseFloat(kpiCoefficient.toFixed(3)),
      totalMonthlyKPI: Math.round(totalMonthlyKPI),
      hasKPIGap,
      workProductivityTotal: parseFloat(workProductivityTotal.toFixed(2)),
      workQualityTotal: Math.round(workQualityTotal),
      pullRequestMergeRatio,
      attitudeTotal: Math.round(attitudeTotal),
      progressTotal: Math.round(progressTotal),
      requirementsTotal: Math.round(requirementsTotal),
      recruitmentTotal: parseFloat(recruitmentTotal.toFixed(2))
    });
  };

  useEffect(() => {
    if (watchedValues.employee_code) {
      fetchSalaryData(watchedValues.employee_code);
    }
  }, [watchedValues.employee_code, month, year]);

  useEffect(() => {
    calculateValues();
  }, [watchedValues, salaryData]);

  return { calculatedValues };
};
