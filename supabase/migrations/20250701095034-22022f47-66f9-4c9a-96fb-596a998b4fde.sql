
-- Add status column to kpi_records table
ALTER TABLE public.kpi_records 
ADD COLUMN status text NOT NULL DEFAULT 'Đang xử lý';
