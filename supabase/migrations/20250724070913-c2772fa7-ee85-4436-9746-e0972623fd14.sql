-- Create expense_types table
CREATE TABLE public.expense_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expense_types ENABLE ROW LEVEL SECURITY;

-- Create policies for expense types
CREATE POLICY "Users can view expense types" 
ON public.expense_types 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create expense types" 
ON public.expense_types 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update expense types" 
ON public.expense_types 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete expense types" 
ON public.expense_types 
FOR DELETE 
USING (true);

-- Insert default expense types
INSERT INTO public.expense_types (name) VALUES
('Lương nhân viên'),
('Thuê văn phòng'),
('Điện nước'),
('Internet'),
('Marketing'),
('Thiết bị'),
('Đi lại'),
('Ăn uống'),
('Khác');