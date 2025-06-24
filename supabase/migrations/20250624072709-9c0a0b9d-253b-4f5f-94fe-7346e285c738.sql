
-- Tạo bảng salary_sheets để lưu trữ thông tin bảng lương
CREATE TABLE public.salary_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_net_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_personal_income_tax DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_company_insurance DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_personal_insurance DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_payment DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, month)
);

-- Thêm RLS cho bảng salary_sheets
ALTER TABLE public.salary_sheets ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép tất cả người dùng có thể xem bảng lương (có thể điều chỉnh sau)
CREATE POLICY "Allow all users to view salary sheets" 
  ON public.salary_sheets 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Tạo policy cho phép tất cả người dùng có thể tạo bảng lương
CREATE POLICY "Allow all users to create salary sheets" 
  ON public.salary_sheets 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Tạo policy cho phép tất cả người dùng có thể cập nhật bảng lương
CREATE POLICY "Allow all users to update salary sheets" 
  ON public.salary_sheets 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Tạo policy cho phép tất cả người dùng có thể xóa bảng lương
CREATE POLICY "Allow all users to delete salary sheets" 
  ON public.salary_sheets 
  FOR DELETE 
  TO authenticated
  USING (true);
