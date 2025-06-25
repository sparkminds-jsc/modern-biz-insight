
-- Remove the unique constraint that prevents duplicate employee bills
ALTER TABLE public.team_report_details 
DROP CONSTRAINT IF EXISTS team_report_details_employee_code_team_month_year_key;
