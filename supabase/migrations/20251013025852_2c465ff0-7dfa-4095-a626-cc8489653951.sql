-- Create allocate table
CREATE TABLE public.allocates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_code text NOT NULL,
  role text NOT NULL DEFAULT 'Member',
  position text NOT NULL DEFAULT 'BE',
  call_kh boolean NOT NULL DEFAULT false,
  project_allocations jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.allocates ENABLE ROW LEVEL SECURITY;

-- Create policies for allocate management
CREATE POLICY "Allow all operations on allocates"
ON public.allocates
FOR ALL
USING (true)
WITH CHECK (true);