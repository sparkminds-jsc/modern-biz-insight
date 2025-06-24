
-- Add the insurance_base_amount column to the salary_details table
ALTER TABLE public.salary_details 
ADD COLUMN insurance_base_amount numeric NOT NULL DEFAULT 0;
