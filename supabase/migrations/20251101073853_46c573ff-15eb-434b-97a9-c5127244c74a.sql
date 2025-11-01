-- Create storage bucket for Reset by Discipline course videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('reset-discipline-course', 'reset-discipline-course', true);

-- Create RLS policies for the bucket
CREATE POLICY "Course videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'reset-discipline-course');

CREATE POLICY "Authenticated users can upload course videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reset-discipline-course' AND auth.role() = 'authenticated');