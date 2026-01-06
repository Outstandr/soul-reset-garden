-- Add job role and position fields to user_discovery
ALTER TABLE public.user_discovery 
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS job_industry TEXT;