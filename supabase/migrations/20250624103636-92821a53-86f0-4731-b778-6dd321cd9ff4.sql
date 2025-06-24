
-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_address TEXT,
  additional_info TEXT,
  invoice_name TEXT NOT NULL,
  payment_unit TEXT NOT NULL DEFAULT 'VND' CHECK (payment_unit IN ('USD', 'VND')),
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Mới tạo' CHECK (status IN ('Mới tạo', 'Đã xuất hóa đơn')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  vnd_exchange_rate NUMERIC,
  payment_status TEXT NOT NULL DEFAULT 'Chưa thu' CHECK (payment_status IN ('Chưa thu', 'Đã thu đủ', 'Thu một phần')),
  remaining_amount NUMERIC NOT NULL DEFAULT 0,
  is_crypto BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_items table for invoice content
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  qty NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  amount NUMERIC NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invoices" 
  ON public.invoices 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create invoices" 
  ON public.invoices 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update invoices" 
  ON public.invoices 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete invoices" 
  ON public.invoices 
  FOR DELETE 
  USING (true);

-- Add RLS policies for invoice_items
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invoice items" 
  ON public.invoice_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create invoice items" 
  ON public.invoice_items 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update invoice items" 
  ON public.invoice_items 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete invoice items" 
  ON public.invoice_items 
  FOR DELETE 
  USING (true);
