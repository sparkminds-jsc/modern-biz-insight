
-- Create kpi_details table to store detailed KPI information
CREATE TABLE public.kpi_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_code TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  has_kpi_gap BOOLEAN NOT NULL DEFAULT false,
  basic_salary NUMERIC NOT NULL DEFAULT 0,
  kpi NUMERIC NOT NULL DEFAULT 0,
  total_salary NUMERIC NOT NULL DEFAULT 0,
  salary_coefficient NUMERIC NOT NULL DEFAULT 0,
  kpi_coefficient NUMERIC NOT NULL DEFAULT 0,
  total_monthly_kpi NUMERIC NOT NULL DEFAULT 0,
  work_productivity JSONB NOT NULL DEFAULT '{}',
  work_quality JSONB NOT NULL DEFAULT '{}',
  attitude JSONB NOT NULL DEFAULT '{}',
  progress JSONB NOT NULL DEFAULT '{}',
  requirements JSONB NOT NULL DEFAULT '{}',
  recruitment JSONB NOT NULL DEFAULT '{}',
  revenue JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.kpi_details ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on kpi_details" 
  ON public.kpi_details 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_kpi_details_month_year ON public.kpi_details(month, year);
CREATE INDEX idx_kpi_details_employee_code ON public.kpi_details(employee_code);
