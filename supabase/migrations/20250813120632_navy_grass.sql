/*
  # Tournament Management System Database Schema

  1. New Tables
    - `users` - User authentication and profile data
    - `events` - Tournament events
    - `teams` - Team registrations
    - `players` - Player information
    - `groups` - Tournament groups
    - `matches` - Match fixtures and results

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Team managers can only access their own data
    - Admins have full access

  3. Functions
    - Auto-assign user role based on email
    - Calculate group standings
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'team_manager' CHECK (role IN ('admin', 'team_manager')),
  team_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'mixed')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  max_teams integer NOT NULL DEFAULT 16,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  coach_name text NOT NULL,
  district text NOT NULL,
  mobile text NOT NULL,
  email text UNIQUE NOT NULL,
  event_id uuid REFERENCES events(id),
  group_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  dob date NOT NULL,
  role text NOT NULL,
  jersey_number integer NOT NULL,
  photo text,
  aadhar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(team_id, jersey_number)
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Group teams junction table
CREATE TABLE IF NOT EXISTS group_teams (
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, team_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id),
  team1_id uuid NOT NULL REFERENCES teams(id),
  team2_id uuid NOT NULL REFERENCES teams(id),
  match_date date,
  match_time time,
  venue text,
  stage text NOT NULL DEFAULT 'group' CHECK (stage IN ('group', 'quarterfinal', 'semifinal', 'final')),
  team1_sets integer DEFAULT 0,
  team2_sets integer DEFAULT 0,
  winner_id uuid REFERENCES teams(id),
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage events" ON events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Teams policies
CREATE POLICY "Anyone can read teams" ON teams
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Team managers can manage own team" ON teams
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'admin' OR users.team_id = teams.id)
    )
  );

CREATE POLICY "Authenticated users can create teams" ON teams
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Players policies
CREATE POLICY "Anyone can read players" ON players
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Team managers can manage own players" ON players
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN teams t ON u.team_id = t.id
      WHERE u.id = auth.uid() 
      AND (u.role = 'admin' OR t.id = players.team_id)
    )
  );

-- Groups policies
CREATE POLICY "Anyone can read groups" ON groups
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage groups" ON groups
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Group teams policies
CREATE POLICY "Anyone can read group teams" ON group_teams
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage group teams" ON group_teams
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Matches policies
CREATE POLICY "Anyone can read matches" ON matches
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage matches" ON matches
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email = 'admin@rollball.com' THEN 'admin'
      ELSE 'team_manager'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update team_id in users table when team is created
CREATE OR REPLACE FUNCTION update_user_team_id()
RETURNS trigger AS $$
BEGIN
  UPDATE users 
  SET team_id = NEW.id 
  WHERE email = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user team_id
DROP TRIGGER IF EXISTS on_team_created ON teams;
CREATE TRIGGER on_team_created
  AFTER INSERT ON teams
  FOR EACH ROW EXECUTE FUNCTION update_user_team_id();

-- Function to calculate group standings
CREATE OR REPLACE FUNCTION get_group_standings(group_uuid uuid)
RETURNS TABLE (
  team_id uuid,
  team_name text,
  matches_played bigint,
  wins bigint,
  losses bigint,
  points bigint,
  sets_won bigint,
  sets_lost bigint,
  set_ratio numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as team_id,
    t.team_name,
    COUNT(m.id) as matches_played,
    SUM(CASE WHEN m.winner_id = t.id THEN 1 ELSE 0 END) as wins,
    SUM(CASE WHEN m.winner_id != t.id AND m.is_completed THEN 1 ELSE 0 END) as losses,
    SUM(CASE WHEN m.winner_id = t.id THEN 2 ELSE 0 END) as points,
    SUM(
      CASE 
        WHEN m.team1_id = t.id THEN m.team1_sets
        WHEN m.team2_id = t.id THEN m.team2_sets
        ELSE 0
      END
    ) as sets_won,
    SUM(
      CASE 
        WHEN m.team1_id = t.id THEN m.team2_sets
        WHEN m.team2_id = t.id THEN m.team1_sets
        ELSE 0
      END
    ) as sets_lost,
    CASE 
      WHEN SUM(
        CASE 
          WHEN m.team1_id = t.id THEN m.team2_sets
          WHEN m.team2_id = t.id THEN m.team1_sets
          ELSE 0
        END
      ) > 0 THEN
        SUM(
          CASE 
            WHEN m.team1_id = t.id THEN m.team1_sets
            WHEN m.team2_id = t.id THEN m.team2_sets
            ELSE 0
          END
        )::numeric / SUM(
          CASE 
            WHEN m.team1_id = t.id THEN m.team2_sets
            WHEN m.team2_id = t.id THEN m.team1_sets
            ELSE 0
          END
        )::numeric
      ELSE 
        SUM(
          CASE 
            WHEN m.team1_id = t.id THEN m.team1_sets
            WHEN m.team2_id = t.id THEN m.team2_sets
            ELSE 0
          END
        )::numeric
    END as set_ratio
  FROM group_teams gt
  JOIN teams t ON gt.team_id = t.id
  LEFT JOIN matches m ON (m.team1_id = t.id OR m.team2_id = t.id) 
    AND m.group_id = group_uuid 
    AND m.is_completed = true
  WHERE gt.group_id = group_uuid
  GROUP BY t.id, t.team_name
  ORDER BY points DESC, set_ratio DESC;
END;
$$ LANGUAGE plpgsql;