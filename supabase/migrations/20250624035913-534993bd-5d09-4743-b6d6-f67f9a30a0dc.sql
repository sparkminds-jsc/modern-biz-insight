
-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  birth_date DATE,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('Fresher', 'Thử việc', 'Một năm', 'Ba năm', 'Vĩnh viễn', 'Thời vụ')),
  contract_end_date DATE,
  position TEXT NOT NULL,
  team TEXT NOT NULL CHECK (team IN ('Team Đạt', 'Team Giang', 'Team Yến', 'Team Support')),
  status TEXT NOT NULL DEFAULT 'Đang làm' CHECK (status IN ('Đang làm', 'Đã nghỉ')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to view all employees
CREATE POLICY "Authenticated users can view employees" 
  ON public.employees 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to insert employees
CREATE POLICY "Authenticated users can create employees" 
  ON public.employees 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy that allows authenticated users to update employees
CREATE POLICY "Authenticated users can update employees" 
  ON public.employees 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to delete employees
CREATE POLICY "Authenticated users can delete employees" 
  ON public.employees 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Insert some sample data
INSERT INTO public.employees (employee_code, full_name, email, birth_date, contract_type, contract_end_date, position, team, status) VALUES
('EMP001', 'Nguyễn Văn An', 'an.nguyen@sparkminds.net', '1990-05-15', 'Vĩnh viễn', NULL, 'Senior Developer', 'Team Đạt', 'Đang làm'),
('EMP002', 'Trần Thị Bình', 'binh.tran@sparkminds.net', '1992-08-20', 'Ba năm', '2026-12-31', 'QA Engineer', 'Team Giang', 'Đang làm'),
('EMP003', 'Lê Văn Cường', 'cuong.le@sparkminds.net', '1988-03-10', 'Một năm', '2025-06-30', 'Project Manager', 'Team Yến', 'Đang làm'),
('EMP004', 'Phạm Thị Dung', 'dung.pham@sparkminds.net', '1995-11-25', 'Thử việc', '2025-03-31', 'Junior Developer', 'Team Support', 'Đang làm'),
('EMP005', 'Hoàng Văn Em', 'em.hoang@sparkminds.net', '1993-07-12', 'Thời vụ', '2025-12-31', 'Designer', 'Team Đạt', 'Đã nghỉ');
