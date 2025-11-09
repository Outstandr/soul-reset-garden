-- Add subtitle columns to masterclass_lessons table
ALTER TABLE masterclass_lessons
ADD COLUMN subtitle_en_url TEXT,
ADD COLUMN subtitle_nl_url TEXT,
ADD COLUMN subtitle_ru_url TEXT;

-- Create a table to track subtitle generation jobs
CREATE TABLE IF NOT EXISTS subtitle_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES masterclass_lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subtitle_generation_jobs
ALTER TABLE subtitle_generation_jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view jobs (for admin purposes)
CREATE POLICY "Anyone can view subtitle jobs"
  ON subtitle_generation_jobs
  FOR SELECT
  USING (true);

-- Create trigger to update updated_at
CREATE TRIGGER update_subtitle_jobs_updated_at
  BEFORE UPDATE ON subtitle_generation_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();