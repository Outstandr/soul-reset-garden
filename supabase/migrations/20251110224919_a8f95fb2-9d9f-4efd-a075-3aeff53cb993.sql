
-- Add content columns to masterclass_lessons table
ALTER TABLE masterclass_lessons 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS key_takeaways JSONB,
ADD COLUMN IF NOT EXISTS action_step TEXT,
ADD COLUMN IF NOT EXISTS reflection_prompt TEXT,
ADD COLUMN IF NOT EXISTS word_count INTEGER;
