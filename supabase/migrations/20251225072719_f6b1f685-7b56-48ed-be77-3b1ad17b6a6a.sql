-- Add gross_salary column to team_report_details table
ALTER TABLE public.team_report_details
ADD COLUMN gross_salary numeric NOT NULL DEFAULT 0;