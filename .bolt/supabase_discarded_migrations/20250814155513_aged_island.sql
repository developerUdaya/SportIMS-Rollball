/*
  # Create storage bucket for player images

  1. Storage
    - Create 'player-images' bucket for storing player profile photos
    - Set up public access for uploaded images
    - Configure RLS policies for secure access

  2. Security
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Restrict delete operations to image owners
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('player-images', 'player-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload player images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'player-images');

-- Allow public read access to images
CREATE POLICY "Allow public read access to player images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'player-images');

-- Allow users to update their own uploaded images
CREATE POLICY "Allow users to update their own player images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'player-images');

-- Allow users to delete their own uploaded images
CREATE POLICY "Allow users to delete their own player images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'player-images');