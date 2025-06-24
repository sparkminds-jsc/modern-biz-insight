
-- Create revenue table
CREATE TABLE public.revenue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  revenue_type TEXT NOT NULL CHECK (revenue_type IN ('Lãi Ngân Hàng', 'Invoice')),
  amount_vnd NUMERIC NOT NULL DEFAULT 0,
  amount_usd NUMERIC NOT NULL DEFAULT 0,
  amount_usdt NUMERIC NOT NULL DEFAULT 0,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('Ngân Hàng', 'Binance', 'Upwork', 'Tiền Mặt')),
  needs_debt_collection BOOLEAN NOT NULL DEFAULT false,
  is_finalized BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to access revenue data
CREATE POLICY "Users can view revenue" 
  ON public.revenue 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create revenue" 
  ON public.revenue 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update revenue" 
  ON public.revenue 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete revenue" 
  ON public.revenue 
  FOR DELETE 
  USING (true);
