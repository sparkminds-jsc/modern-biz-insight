-- Add project_id column to team_report_details table
ALTER TABLE public.team_report_details 
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;