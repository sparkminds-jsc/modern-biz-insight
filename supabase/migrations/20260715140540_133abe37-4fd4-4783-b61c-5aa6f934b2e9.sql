
ALTER TABLE public.revenue ADD COLUMN IF NOT EXISTS transaction_number TEXT;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS transaction_number TEXT;
CREATE INDEX IF NOT EXISTS idx_revenue_transaction_number ON public.revenue(transaction_number);
CREATE INDEX IF NOT EXISTS idx_expenses_transaction_number ON public.expenses(transaction_number);
INSERT INTO public.expense_types (name) SELECT 'Chưa phân loại' WHERE NOT EXISTS (SELECT 1 FROM public.expense_types WHERE name = 'Chưa phân loại');
