
-- Create table for team reports
CREATE TABLE public.team_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  team TEXT NOT NULL,
  final_bill NUMERIC NOT NULL DEFAULT 0,
  final_pay NUMERIC NOT NULL DEFAULT 0,
  final_save NUMERIC NOT NULL DEFAULT 0,
  final_earn NUMERIC NOT NULL DEFAULT 0,
  storage_usd NUMERIC NOT NULL DEFAULT 0,
  storage_usdt NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, month, team)
);

-- Add Row Level Security
ALTER TABLE public.team_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for team_reports
CREATE POLICY "Anyone can view team reports" 
  ON public.team_reports 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert team reports" 
  ON public.team_reports 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update team reports" 
  ON public.team_reports 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete team reports" 
  ON public.team_reports 
  FOR DELETE 
  TO authenticated
  USING (true);
