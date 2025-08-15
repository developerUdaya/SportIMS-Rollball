/*
  # Create Users Authentication Table

  1. New Tables
    - `users` - User authentication and profile data with password storage
    
  2. Security
    - Enable RLS on users table
    - Add policies for user access
    
  3. Changes
    - Remove dependency on auth.users
    - Add password field for authentication
    - Add proper indexes for performance
*/

-- Drop existing users table and recreate without auth dependency
DROP TABLE IF EXISTS users CASCADE;

-- Create users table for authentication
CREATE TABLE users (
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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Anyone can create user account" ON users
  FOR INSERT TO anon
  WITH CHECK (true);

-- Insert default admin user
INSERT INTO users (email, password, name, role) 
VALUES ('admin@rollball.com', 'admin123', 'Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Update foreign key constraint in teams table
ALTER TABLE teams 
DROP CONSTRAINT IF EXISTS teams_event_id_fkey;

ALTER TABLE teams 
ADD CONSTRAINT teams_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;

-- Remove the auth trigger functions since we're not using Supabase auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();