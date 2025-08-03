-- Drop existing constraint
ALTER TABLE public.invoices DROP CONSTRAINT invoices_status_check;

-- Add updated constraint with new status value
ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_status_check 
CHECK (status IN ('Mới tạo', 'Đã xuất hóa đơn', 'Không xuất hóa đơn'));