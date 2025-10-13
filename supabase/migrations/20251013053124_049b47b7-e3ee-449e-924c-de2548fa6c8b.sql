-- Create table for project estimates
CREATE TABLE public.project_estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  is_estimated BOOLEAN NOT NULL DEFAULT false,
  estimated_duration INTEGER NOT NULL DEFAULT 1,
  team_revenues JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for team average costs
CREATE TABLE public.team_average_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team TEXT NOT NULL UNIQUE,
  average_monthly_cost NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_average_costs ENABLE ROW LEVEL SECURITY;

-- Create policies for project_estimates
CREATE POLICY "Allow all operations on project_estimates"
ON public.project_estimates
FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for team_average_costs
CREATE POLICY "Allow all operations on team_average_costs"
ON public.team_average_costs
FOR ALL
USING (true)
WITH CHECK (true);