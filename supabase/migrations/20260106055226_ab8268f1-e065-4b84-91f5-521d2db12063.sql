-- Create table for user discovery responses
CREATE TABLE public.user_discovery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  health_level INTEGER NOT NULL CHECK (health_level >= 1 AND health_level <= 10),
  primary_goal TEXT NOT NULL,
  biggest_challenge TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_discovery ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own discovery" 
ON public.user_discovery 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own discovery" 
ON public.user_discovery 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discovery" 
ON public.user_discovery 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_discovery_updated_at
BEFORE UPDATE ON public.user_discovery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();