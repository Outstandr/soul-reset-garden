-- Create storage bucket for masterclass videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'masterclass-videos',
  'masterclass-videos',
  true,
  524288000, -- 500MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Policy: Anyone can view videos (public read access)
CREATE POLICY "Public Access to Masterclass Videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'masterclass-videos');

-- Policy: Authenticated users can upload videos
CREATE POLICY "Authenticated users can upload masterclass videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'masterclass-videos' 
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update masterclass videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'masterclass-videos' AND auth.role() = 'authenticated');

-- Policy: Authenticated users can delete videos
CREATE POLICY "Authenticated users can delete masterclass videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'masterclass-videos' AND auth.role() = 'authenticated');