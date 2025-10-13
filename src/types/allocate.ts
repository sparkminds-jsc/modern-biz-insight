export interface Allocate {
  id: string;
  employee_code: string;
  role: string;
  position: string;
  call_kh: boolean;
  project_allocations: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface AllocateFormData {
  employee_code: string;
  role: string;
  position: string;
  call_kh: boolean;
  project_allocations: Record<string, string>;
}
