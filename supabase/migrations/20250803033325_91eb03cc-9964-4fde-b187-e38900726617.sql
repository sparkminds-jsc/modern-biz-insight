-- Update status column to allow new status value and remove default constraint
ALTER TABLE public.invoices 
ALTER COLUMN status DROP DEFAULT;

-- Add check constraint to ensure only valid status values
ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_status_check 
CHECK (status IN ('Mới tạo', 'Đã xuất hóa đơn', 'Không xuất hóa đơn'));

-- Set default value again
ALTER TABLE public.invoices 
ALTER COLUMN status SET DEFAULT 'Mới tạo';