-- Add is_locked column to team_report_details table
ALTER TABLE team_report_details ADD COLUMN is_locked BOOLEAN DEFAULT false;