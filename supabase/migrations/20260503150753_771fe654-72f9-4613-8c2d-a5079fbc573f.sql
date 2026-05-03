CREATE TABLE public.salary_increase_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  year INTEGER NOT NULL,
  gross_salary NUMERIC NOT NULL DEFAULT 0,
  company_payment NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_salary_increase_history_employee ON public.salary_increase_history(employee_id);

ALTER TABLE public.salary_increase_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view salary increase history"
ON public.salary_increase_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert salary increase history"
ON public.salary_increase_history FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update salary increase history"
ON public.salary_increase_history FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete salary increase history"
ON public.salary_increase_history FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_salary_increase_history_updated_at
BEFORE UPDATE ON public.salary_increase_history
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();