-- Drop the old constraint
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_expense_type_check;

-- Note: Instead of a CHECK constraint with a fixed list, 
-- we'll allow any expense_type since the valid types are managed in the expense_types table