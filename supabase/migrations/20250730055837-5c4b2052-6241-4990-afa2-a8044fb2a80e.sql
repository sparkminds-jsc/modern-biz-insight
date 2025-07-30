-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Đang chạy',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for project access
CREATE POLICY "Allow all operations on projects" 
ON public.projects 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_projects_updated_at();