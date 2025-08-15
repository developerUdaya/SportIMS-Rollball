/*
  # Fix User Registration Database Error

  1. Schema Updates
    - Add proper foreign key constraint for team_id in users table
    - Update handle_new_user function to explicitly handle team_id

  2. Changes
    - Modify users table to have proper foreign key relationship
    - Fix the trigger function to include team_id explicitly as NULL
*/

-- Add foreign key constraint to users.team_id
ALTER TABLE users 
ADD CONSTRAINT users_team_id_fkey 
FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- Update the handle_new_user function to explicitly include team_id
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, role, team_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email = 'admin@rollball.com' THEN 'admin'
      ELSE 'team_manager'
    END,
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;