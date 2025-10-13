-- Add unique constraint on employee_code in allocates table
ALTER TABLE allocates
ADD CONSTRAINT allocates_employee_code_unique UNIQUE (employee_code);