-- First drop any existing constraint with this name if it exists
ALTER TABLE user_lesson_progress 
DROP CONSTRAINT IF EXISTS user_lesson_progress_user_lesson_unique;

-- Add unique constraint to prevent duplicate progress records
ALTER TABLE user_lesson_progress 
ADD CONSTRAINT user_lesson_progress_user_lesson_unique 
UNIQUE (user_id, lesson_id);