-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload masterclass videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update masterclass videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete masterclass videos" ON storage.objects;

-- Create more permissive policies for development
-- Anyone can upload to masterclass-videos bucket
CREATE POLICY "Allow uploads to masterclass videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'masterclass-videos');

-- Anyone can update videos in masterclass bucket
CREATE POLICY "Allow updates to masterclass videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'masterclass-videos');

-- Anyone can delete videos in masterclass bucket  
CREATE POLICY "Allow deletes from masterclass videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'masterclass-videos');