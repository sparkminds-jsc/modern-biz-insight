
-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  expense_type TEXT NOT NULL CHECK (expense_type IN ('Lương', 'Bảo Hiểm', 'Thuế TNCN', 'Chia cổ tức', 'Chi phí Luật', 'Ứng Lương', 'Chi phí Tool', 'Mua thiết bị', 'Sửa chữa thiết bị', 'Thuê văn phòng', 'Tuyển dụng', 'Chi phí ngân hàng', 'Đồng Phục', 'Quà Tết', 'Team Building', 'Ăn uống', 'Điện', 'Giữ xe', 'Quà SN', 'Quà tặng KH', 'Trang trí', 'Nước uống', 'Rút tiền mặt')),
  amount_vnd NUMERIC NOT NULL DEFAULT 0,
  amount_usd NUMERIC NOT NULL DEFAULT 0,
  amount_usdt NUMERIC NOT NULL DEFAULT 0,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('Ngân Hàng', 'Binance', 'Upwork', 'Tiền Mặt')),
  notes TEXT,
  invoice_files JSONB DEFAULT '[]'::jsonb,
  is_finalized BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to access expenses data
CREATE POLICY "Users can view expenses" 
  ON public.expenses 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create expenses" 
  ON public.expenses 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update expenses" 
  ON public.expenses 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete expenses" 
  ON public.expenses 
  FOR DELETE 
  USING (true);
