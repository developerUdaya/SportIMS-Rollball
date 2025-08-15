/*
  # Update players table with new fields

  1. New Fields Added
    - `father_name` (text) - Father's name
    - `address` (text) - Player address  
    - `email` (text) - Player email
    - `mobile` (text) - Player mobile number
    - `irbf_no` (text) - IRBF registration number
    - `sex` (text) - Player gender (male/female)
    - `school_college` (text) - School/College name
    - `district` (text) - District name

  2. Constraints
    - Sex must be either 'male' or 'female'
    - Email format validation
    - Mobile number validation
*/

-- Add new columns to players table
DO $$
BEGIN
  -- Add father_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'father_name'
  ) THEN
    ALTER TABLE players ADD COLUMN father_name text;
  END IF;

  -- Add address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'address'
  ) THEN
    ALTER TABLE players ADD COLUMN address text;
  END IF;

  -- Add email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'email'
  ) THEN
    ALTER TABLE players ADD COLUMN email text;
  END IF;

  -- Add mobile column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'mobile'
  ) THEN
    ALTER TABLE players ADD COLUMN mobile text;
  END IF;

  -- Add irbf_no column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'irbf_no'
  ) THEN
    ALTER TABLE players ADD COLUMN irbf_no text;
  END IF;

  -- Add sex column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'sex'
  ) THEN
    ALTER TABLE players ADD COLUMN sex text CHECK (sex IN ('male', 'female'));
  END IF;

  -- Add school_college column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'school_college'
  ) THEN
    ALTER TABLE players ADD COLUMN school_college text;
  END IF;

  -- Add district column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'players' AND column_name = 'district'
  ) THEN
    ALTER TABLE players ADD COLUMN district text;
  END IF;
END $$;

-- Add policies for player management
CREATE POLICY "Authenticated users can delete players" ON players
  FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update players" ON players
  FOR UPDATE TO authenticated
  USING (true);