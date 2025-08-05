-- Add date columns to track when birthday gifts were given and contracts were signed
ALTER TABLE employee_events 
ADD COLUMN birthday_gift_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN contract_signed_date TIMESTAMP WITH TIME ZONE;