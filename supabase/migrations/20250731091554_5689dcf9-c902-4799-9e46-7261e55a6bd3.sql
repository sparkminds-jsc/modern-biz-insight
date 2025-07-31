-- Add project_id column to invoices table
ALTER TABLE public.invoices 
ADD COLUMN project_id uuid REFERENCES public.projects(id);