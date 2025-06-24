
-- Add status column to salary_sheets table to track completion
ALTER TABLE public.salary_sheets 
ADD COLUMN status text NOT NULL DEFAULT 'Đang xử lý';

-- Add constraint to ensure valid status values
ALTER TABLE public.salary_sheets 
ADD CONSTRAINT salary_sheets_status_check 
CHECK (status IN ('Đang xử lý', 'Hoàn thành'));
