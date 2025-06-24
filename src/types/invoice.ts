
export interface Invoice {
  id: string;
  customer_name: string;
  customer_address: string | null;
  additional_info: string | null;
  invoice_name: string;
  payment_unit: 'USD' | 'VND';
  created_date: string;
  due_date: string;
  status: 'Mới tạo' | 'Đã xuất hóa đơn';
  total_amount: number;
  vnd_exchange_rate: number | null;
  payment_status: 'Chưa thu' | 'Đã thu đủ' | 'Thu một phần';
  remaining_amount: number;
  is_crypto: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  unit: string;
  qty: number;
  unit_price: number;
  amount: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceFilters {
  customer_name: string;
  invoice_name: string;
  status: string;
  payment_status: string;
  is_crypto: string;
}

export interface CreateInvoiceData {
  customer_name: string;
  customer_address?: string;
  additional_info?: string;
  invoice_name: string;
  payment_unit: 'USD' | 'VND';
  created_date: string;
  due_date: string;
  status: 'Mới tạo' | 'Đã xuất hóa đơn';
  vnd_exchange_rate?: number;
  payment_status: 'Chưa thu' | 'Đã thu đủ' | 'Thu một phần';
  remaining_amount: number;
  is_crypto: boolean;
}

export interface CreateInvoiceItemData {
  description: string;
  unit: string;
  qty: number;
  unit_price: number;
  note?: string;
}
