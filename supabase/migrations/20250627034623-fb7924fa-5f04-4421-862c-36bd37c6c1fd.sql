
-- Create table to store employee event status
CREATE TABLE public.employee_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  birthday_handled BOOLEAN DEFAULT FALSE,
  contract_handled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

-- Enable RLS
ALTER TABLE public.employee_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on employee_events" 
  ON public.employee_events 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
