-- Add estimated_bill column to project_estimates table
ALTER TABLE project_estimates
ADD COLUMN estimated_bill numeric DEFAULT 0;