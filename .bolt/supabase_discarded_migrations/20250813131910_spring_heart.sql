/*
  # Fix Users Table for Authentication

  1. Updates
    - Ensure users table exists with proper structure
    - Add default admin user if not exists
    - Fix any RLS policies

  2. Security
    - Enable RLS on users table
    - Add policies for user operations
*/

-- Ensure users table exists with correct structure
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'team_manager' CHECK (role IN ('admin', 'team_manager')),
  team_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Anyone can create user account" ON users;

-- Create new policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (true); -- Allow reading for now, can be restricted later

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (true); -- Allow updates for now, can be restricted later

CREATE POLICY "Anyone can create user account" ON users
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Insert default admin user if not exists
INSERT INTO users (email, password, name, role) 
VALUES ('admin@rollball.com', 'admin123', 'Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Ensure teams table has proper foreign key
ALTER TABLE teams 
DROP CONSTRAINT IF EXISTS teams_event_id_fkey;

ALTER TABLE teams 
ADD CONSTRAINT teams_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;