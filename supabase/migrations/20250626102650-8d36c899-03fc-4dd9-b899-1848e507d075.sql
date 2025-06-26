
-- Create kpi_records table to store KPI records
CREATE TABLE public.kpi_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_employees_with_kpi_gap INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month, year)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.kpi_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this appears to be an internal management system)
CREATE POLICY "Allow all operations on kpi_records" 
  ON public.kpi_records 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
