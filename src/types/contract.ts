
export interface Contract {
  id: string;
  contract_code: string;
  contract_name: string;
  customer_name: string;
  sign_date: string;
  expire_date: string;
  contract_files: ContractFile[];
  auto_renewal: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContractFile {
  id: string;
  name: string;
  url: string;
  size: number;
}

export interface ContractSortConfig {
  key: keyof Contract | null;
  direction: 'asc' | 'desc';
}

export interface ContractFilters {
  customer_name: string;
  auto_renewal: string;
}
