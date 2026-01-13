-- Add earn_vnd and earn_usdt columns to team_report_details table
ALTER TABLE public.team_report_details 
ADD COLUMN IF NOT EXISTS earn_vnd numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS earn_usdt numeric DEFAULT 0;

-- Update existing records with calculated values
-- earn_vnd = converted_vnd + package_vnd - total_payment
-- earn_usdt = storage_usdt * 0.7
UPDATE public.team_report_details 
SET 
  earn_vnd = COALESCE(converted_vnd, 0) + COALESCE(package_vnd, 0) - COALESCE(total_payment, 0),
  earn_usdt = COALESCE(storage_usdt, 0) * 0.7;