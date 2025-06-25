
-- Create table for detailed team reports (employee bills)
CREATE TABLE public.team_report_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_code TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  team TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  billable_hours NUMERIC NOT NULL DEFAULT 0,
  rate NUMERIC NOT NULL DEFAULT 0,
  fx_rate NUMERIC NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  converted_vnd NUMERIC GENERATED ALWAYS AS (billable_hours * rate * fx_rate * percentage / 100) STORED,
  package_vnd NUMERIC NOT NULL DEFAULT 0,
  has_salary BOOLEAN NOT NULL DEFAULT false,
  company_payment NUMERIC NOT NULL DEFAULT 0,
  salary_13 NUMERIC NOT NULL DEFAULT 0,
  total_payment NUMERIC GENERATED ALWAYS AS (company_payment + salary_13) STORED,
  percentage_ratio NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN (billable_hours * rate * fx_rate * percentage / 100 + package_vnd) = 0 THEN 0
      ELSE (company_payment + salary_13) / (billable_hours * rate * fx_rate * percentage / 100 + package_vnd) * 100
    END
  ) STORED,
  storage_usd NUMERIC NOT NULL DEFAULT 0,
  storage_usdt NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_code, team, month, year)
);

-- Add Row Level Security
ALTER TABLE public.team_report_details ENABLE ROW LEVEL SECURITY;

-- Create policies for team_report_details
CREATE POLICY "Anyone can view team report details" 
  ON public.team_report_details 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert team report details" 
  ON public.team_report_details 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update team report details" 
  ON public.team_report_details 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete team report details" 
  ON public.team_report_details 
  FOR DELETE 
  TO authenticated
  USING (true);
