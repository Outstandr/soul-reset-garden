-- Policies for reset-discipline-course bucket uploads
CREATE POLICY "Allow authenticated uploads to reset-discipline-course"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'reset-discipline-course' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access to reset-discipline-course"
ON storage.objects
FOR SELECT
USING (bucket_id = 'reset-discipline-course');

CREATE POLICY "Allow authenticated updates to reset-discipline-course"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'reset-discipline-course'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated deletes from reset-discipline-course"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'reset-discipline-course'
  AND auth.role() = 'authenticated'
);

-- Policies for masterclass-videos bucket
CREATE POLICY "Allow authenticated uploads to masterclass-videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'masterclass-videos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public access to masterclass-videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'masterclass-videos');

CREATE POLICY "Allow authenticated updates to masterclass-videos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'masterclass-videos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated deletes from masterclass-videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'masterclass-videos'
  AND auth.role() = 'authenticated'
);