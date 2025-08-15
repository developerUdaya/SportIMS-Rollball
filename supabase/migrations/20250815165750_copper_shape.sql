/*
  # Add document fields to players table

  1. New Fields Added
    - `aadhar_certificate` (text) - URL to uploaded Aadhar certificate
    - `birth_certificate` (text) - URL to uploaded birth certificate  
    - `irbf_certificate` (text) - URL to uploaded IRBF certificate

  2. Security
    - Enable storage for player documents
    - Add policies for document access
*/

-- Add document columns to players table
DO $$
BEGIN
  -- Add aadhar_certificate column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'aadhar_certificate'
  ) THEN
    ALTER TABLE players ADD COLUMN aadhar_certificate text;
  END IF;

  -- Add birth_certificate column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'birth_certificate'
  ) THEN
    ALTER TABLE players ADD COLUMN birth_certificate text;
  END IF;

  -- Add irbf_certificate column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'irbf_certificate'
  ) THEN
    ALTER TABLE players ADD COLUMN irbf_certificate text;
  END IF;
END $$;

-- Create storage bucket for player documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('player-documents', 'player-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for player documents
CREATE POLICY "Anyone can view player documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'player-documents');

CREATE POLICY "Authenticated users can upload player documents" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'player-documents');

CREATE POLICY "Authenticated users can update player documents" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'player-documents');

CREATE POLICY "Authenticated users can delete player documents" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'player-documents');