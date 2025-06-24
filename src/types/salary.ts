
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
