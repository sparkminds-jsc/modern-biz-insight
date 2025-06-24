
-- Create contracts table
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_code TEXT NOT NULL UNIQUE,
  contract_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  sign_date DATE NOT NULL,
  expire_date DATE NOT NULL,
  contract_files JSONB DEFAULT '[]'::jsonb,
  auto_renewal BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Đang còn',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for contracts
CREATE POLICY "Allow all operations on contracts" 
  ON public.contracts 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for contract files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', true);

-- Create policy for contract files storage
CREATE POLICY "Allow all operations on contract files" 
  ON storage.objects 
  FOR ALL 
  USING (bucket_id = 'contracts')
  WITH CHECK (bucket_id = 'contracts');
