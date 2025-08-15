/*
  # Update events table with DOB range fields

  1. New Fields Added
    - `min_dob` (date) - Minimum date of birth for participants
    - `max_dob` (date) - Maximum date of birth for participants

  2. Validation
    - min_dob should be before max_dob
    - Both dates are required for proper age validation
*/

-- Add DOB range columns to events table
DO $$
BEGIN
  -- Add min_dob column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'min_dob'
  ) THEN
    ALTER TABLE events ADD COLUMN min_dob date;
  END IF;

  -- Add max_dob column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'max_dob'
  ) THEN
    ALTER TABLE events ADD COLUMN max_dob date;
  END IF;
END $$;

-- Add constraint to ensure min_dob is before max_dob
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'events_dob_range_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_dob_range_check 
    CHECK (min_dob IS NULL OR max_dob IS NULL OR min_dob <= max_dob);
  END IF;
END $$;