
-- Add email_sent column to salary_sheets table
ALTER TABLE public.salary_sheets 
ADD COLUMN email_sent boolean NOT NULL DEFAULT false;
