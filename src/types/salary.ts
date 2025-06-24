
export interface SalarySheet {
  id: string;
  year: number;
  month: number;
  total_net_salary: number;
  total_personal_income_tax: number;
  total_company_insurance: number;
  total_personal_insurance: number;
  total_payment: number;
  created_at: string;
  updated_at: string;
}

export interface SalaryDetail {
  id: string;
  salary_sheet_id: string;
  employee_code: string;
  employee_name: string;
  team: string;
  month: number;
  year: number;
  gross_salary: number;
  working_days: number;
  daily_rate: number;
  daily_salary: number;
  kpi_bonus: number;
  overtime_1_5: number;
  overtime_2: number;
  overtime_3: number;
  total_income: number;
  insurance_base_amount: number;
  bhdn_bhxh: number;
  bhdn_tnld: number;
  bhdn_bhyt: number;
  bhdn_bhtn: number;
  total_bhdn: number;
  total_company_payment: number;
  bhnld_bhxh: number;
  bhnld_bhyt: number;
  bhnld_bhtn: number;
  total_bhnld: number;
  personal_deduction: number;
  dependent_count: number;
  dependent_deduction: number;
  insurance_deduction: number;
  total_deduction: number;
  taxable_income: number;
  tax_5_percent: number;
  tax_10_percent: number;
  tax_15_percent: number;
  tax_20_percent: number;
  tax_25_percent: number;
  tax_30_percent: number;
  tax_35_percent: number;
  total_personal_income_tax: number;
  net_salary: number;
  advance_payment: number;
  actual_payment: number;
  created_at: string;
  updated_at: string;
}

export interface SalaryFilters {
  months: number[];
  years: number[];
}

export interface SalarySummary {
  total_net_salary: number;
  total_personal_income_tax: number;
  total_company_insurance: number;
  total_personal_insurance: number;
  total_payment: number;
}

export interface SalaryDetailFilters {
  employee_code: string;
  employee_name: string;
  team: string;
}

export interface SalaryDetailSummary {
  total_net_salary: number;
  total_personal_income_tax: number;
  total_company_insurance: number;
  total_personal_insurance: number;
  total_payment: number;
}
