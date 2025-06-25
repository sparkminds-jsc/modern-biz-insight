
-- Create a table to store teams
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert existing teams from employees table
INSERT INTO public.teams (name)
SELECT DISTINCT team
FROM public.employees
WHERE team IS NOT NULL AND team != ''
ON CONFLICT (name) DO NOTHING;
