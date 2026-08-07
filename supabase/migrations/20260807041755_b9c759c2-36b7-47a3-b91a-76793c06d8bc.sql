ALTER TABLE public.invoice_items ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id);

UPDATE public.invoice_items ii
SET project_id = i.project_id
FROM public.invoices i
WHERE ii.invoice_id = i.id AND ii.project_id IS NULL AND i.project_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_invoice_items_project_id ON public.invoice_items(project_id);