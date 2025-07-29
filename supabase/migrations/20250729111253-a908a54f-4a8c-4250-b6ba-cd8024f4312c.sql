-- Add is_locked column to kpi_details table
ALTER TABLE kpi_details ADD COLUMN is_locked BOOLEAN DEFAULT false;