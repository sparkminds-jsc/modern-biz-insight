-- Add is_locked column to salary_details table
ALTER TABLE salary_details ADD COLUMN is_locked BOOLEAN DEFAULT false;