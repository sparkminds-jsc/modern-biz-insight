export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: string;
}