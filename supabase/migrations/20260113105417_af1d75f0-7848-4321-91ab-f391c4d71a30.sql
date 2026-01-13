-- Update existing records with new formula for earn_vnd
-- earn_vnd = (converted_vnd + package_vnd) * 0.7 - total_payment
UPDATE public.team_report_details 
SET earn_vnd = (COALESCE(converted_vnd, 0) + COALESCE(package_vnd, 0)) * 0.7 - COALESCE(total_payment, 0);