-- Add project_id column to revenue table
ALTER TABLE public.revenue 
ADD COLUMN project_id uuid REFERENCES public.projects(id);