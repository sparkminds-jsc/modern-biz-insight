export interface CustomerContact {
  id: string;
  customer_id: string;
  name: string;
  position?: string;
  contact_info?: string;
  last_contact_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
