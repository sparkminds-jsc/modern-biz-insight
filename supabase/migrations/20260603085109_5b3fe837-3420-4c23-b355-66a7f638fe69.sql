
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view settings"
ON public.app_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert settings"
ON public.app_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update settings"
ON public.app_settings FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_settings (key, value) VALUES
  ('personal_deduction', 15500000),
  ('dependent_deduction', 6200000)
ON CONFLICT (key) DO NOTHING;
