export interface Customer {
  id: string;
  name: string;
  address?: string;
  country?: string;
  customer_type: string;
  status: string;
  vip_level: string;
  potential_level: string;
  last_contact_date?: string;
  total_revenue: number;
  total_debt: number;
  first_project?: string;
  first_project_start_date?: string;
  latest_project?: string;
  latest_project_end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const CUSTOMER_TYPES = [
  'Cá nhân',
  'Công ty khởi nghiệp',
  'Công ty lớn'
] as const;

export const CUSTOMER_STATUSES = [
  'Chưa kết nối',
  'Đã kết nối',
  'Đã kí HĐ',
  'Dự án đang dang dở',
  'Đã hoàn thành dự án đầu',
  'Đã trở thành khách hàng thân thiết',
  'Đã là khách hàng VIP'
] as const;

export const VIP_LEVELS = [
  'Bỏ qua',
  'Ít chú ý cũng được',
  'Cần chú ý nhiều 1 chút',
  'Cần chú ý kĩ càng',
  'Cần phục vụ hết mình',
  'Cần xem như thượng đế'
] as const;

export const POTENTIAL_LEVELS = [
  'Không đáng đầu tư',
  'Đầu tư nhỏ cũng được',
  'Đầu tư vừa',
  'Đầu tư lớn',
  'Đầu tư hết mình'
] as const;
