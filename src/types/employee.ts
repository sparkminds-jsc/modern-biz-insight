
export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  birth_date: string | null;
  contract_type: string;
  contract_end_date: string | null;
  position: string;
  team: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SortConfig {
  key: keyof Employee | null;
  direction: 'asc' | 'desc';
}
