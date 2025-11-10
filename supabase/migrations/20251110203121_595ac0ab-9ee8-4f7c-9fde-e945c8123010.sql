-- Create table for user highlights
CREATE TABLE IF NOT EXISTS public.user_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  highlight_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user reflections
CREATE TABLE IF NOT EXISTS public.user_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  reflection_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for highlights
CREATE POLICY "Users can view their own highlights"
ON public.user_highlights
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own highlights"
ON public.user_highlights
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own highlights"
ON public.user_highlights
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for reflections
CREATE POLICY "Users can view their own reflections"
ON public.user_reflections
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reflections"
ON public.user_reflections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
ON public.user_reflections
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updating updated_at on reflections
CREATE TRIGGER update_user_reflections_updated_at
BEFORE UPDATE ON public.user_reflections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();