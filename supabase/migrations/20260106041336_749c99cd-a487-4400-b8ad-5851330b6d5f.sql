-- Add onboarding tracking column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_completed_onboarding boolean DEFAULT false;