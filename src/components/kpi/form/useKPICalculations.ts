
import { useMemo } from 'react';
import { FormData, CalculatedValues, SalaryData } from './kpiFormTypes';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export function useKPICalculations(watchedValues: FormData, month: number, year: number) {
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      if (!watchedValues.employee_code) return;

      try {
        const { data, error } = await supabase
          .from('salary_details')
          .select('gross_salary, kpi_bonus, overtime_1_5, overtime_2, overtime_3')
          .eq('employee_code', watchedValues.employee_code)
          .eq('month', month)
          .eq('year', year)
          .single();

        if (error) {
          console.error('Error fetching salary data:', error);
          setSalaryData(null);
        } else {
          setSalaryData(data);
        }
      } catch (error) {
        console.error('Error fetching salary data:', error);
        setSalaryData(null);
      }
    };

    fetchSalaryData();
  }, [watchedValues.employee_code, month, year]);

  const calculatedValues = useMemo((): CalculatedValues => {
    // Helper function to convert string values to numbers, treating 'na' as 0
    const parseValue = (value: string | number): number => {
      if (typeof value === 'number') return value;
      if (value === 'na' || value === '') return 0;
      return parseFloat(value) || 0;
    };

    const basicSalary = salaryData?.gross_salary || 0;
    const kpi = salaryData 
      ? (salaryData.kpi_bonus + salaryData.overtime_1_5 + salaryData.overtime_2 + salaryData.overtime_3)
      : 0;

    const totalSalary = basicSalary + kpi;
    const salaryCoefficient = basicSalary > 0 ? parseFloat((kpi / basicSalary).toFixed(3)) : 0;

    // Work Productivity calculations
    const workProductivityTotal = 
      parseValue(watchedValues.completedOnTime) -
      (watchedValues.overdueTask * 0.01) +
      parseValue(watchedValues.taskTarget) +
      parseValue(watchedValues.effortRatio) +
      parseValue(watchedValues.gitActivity);

    // Work Quality calculations (new formula: Merge ratio - Bug production * 0.0005 - Bug test * 0.00001)
    const workQualityTotal = 
      parseValue(watchedValues.mergeRatio) -
      (watchedValues.prodBugs * 0.0005) -
      (watchedValues.testBugs * 0.00001);

    // Attitude calculations (new formula: Positive attitude + Tech sharing * 0.001 + Tech articles * 0.001)
    const attitudeTotal = 
      parseValue(watchedValues.positiveAttitude) +
      (watchedValues.techSharing * 0.001) +
      (watchedValues.techArticles * 0.001);

    // Progress calculations (new formula: On time completion + Story point accuracy + Plan changes * 0.01)
    const progressTotal = 
      parseValue(watchedValues.onTimeCompletion) +
      parseValue(watchedValues.storyPointAccuracy) +
      (watchedValues.planChanges * 0.01);

    // Requirements calculations (new formula: -(Change requests * 0.001 + Misunderstanding errors * 0.001))
    const requirementsTotal = 
      -((watchedValues.changeRequests * 0.001) +
        (watchedValues.misunderstandingErrors * 0.001));

    // Recruitment calculations (new formula: CV count only)
    const recruitmentTotal = parseValue(watchedValues.cvCount);

    // KPI Coefficient calculation
    const kpiCoefficient = 
      workProductivityTotal +
      workQualityTotal +
      attitudeTotal +
      progressTotal +
      requirementsTotal +
      recruitmentTotal;

    // Total Monthly KPI calculation
    const totalMonthlyKPI = 
      (basicSalary * kpiCoefficient) +
      (100000 * watchedValues.mentoring) +
      (parseValue(watchedValues.teamManagement) * 2000000) +
      (watchedValues.clientsOver100M * 4000000) +
      watchedValues.locTarget +
      watchedValues.lotTarget +
      (watchedValues.passedCandidates * 500000) +
      parseValue(watchedValues.recruitmentCost);

    const hasKPIGap = Math.abs(kpi - totalMonthlyKPI) > 0.01;

    return {
      basicSalary,
      kpi,
      totalSalary,
      salaryCoefficient,
      kpiCoefficient: parseFloat(kpiCoefficient.toFixed(3)),
      totalMonthlyKPI: parseFloat(totalMonthlyKPI.toFixed(2)),
      hasKPIGap,
      workProductivityTotal: parseFloat(workProductivityTotal.toFixed(2)),
      workQualityTotal: parseFloat(workQualityTotal.toFixed(2)),
      attitudeTotal: parseFloat(attitudeTotal.toFixed(2)),
      progressTotal: parseFloat(progressTotal.toFixed(2)),
      requirementsTotal: parseFloat(requirementsTotal.toFixed(2)),
      recruitmentTotal: parseFloat(recruitmentTotal.toFixed(2))
    };
  }, [watchedValues, salaryData]);

  return { calculatedValues };
}
