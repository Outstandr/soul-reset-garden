
-- Add assignment_responses column to user_lesson_progress to store user's assignment answers
ALTER TABLE user_lesson_progress 
ADD COLUMN IF NOT EXISTS assignment_responses JSONB DEFAULT '{}'::jsonb;
