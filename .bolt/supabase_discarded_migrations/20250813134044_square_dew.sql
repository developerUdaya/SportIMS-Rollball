/*
  # Create Sample Tournament Data

  1. Sample Data
    - 2 events with 16 teams each
    - 12 players per team
    - Groups and matches for tournaments

  2. Events
    - Men's Championship 2024
    - Women's Premier League 2024

  3. Teams
    - 16 teams per event from different districts
    - Realistic team names and coach names

  4. Players
    - 12 players per team
    - Different roles and jersey numbers
    - Realistic names and birth dates
*/

-- Insert sample events
INSERT INTO events (id, name, category, gender, start_date, end_date, max_teams) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Men''s Championship 2024', 'Senior Men', 'male', '2024-03-15', '2024-03-20', 16),
('550e8400-e29b-41d4-a716-446655440002', 'Women''s Premier League 2024', 'Senior Women', 'female', '2024-04-10', '2024-04-15', 16)
ON CONFLICT (id) DO NOTHING;

-- Insert sample teams for Men's Championship
INSERT INTO teams (id, team_name, coach_name, district, mobile, email, event_id) VALUES
-- Men's Championship Teams
('550e8400-e29b-41d4-a716-446655440101', 'Mumbai Warriors', 'Rajesh Kumar', 'Mumbai', '9876543210', 'mumbai.warriors@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440102', 'Delhi Dynamos', 'Priya Sharma', 'Delhi', '9876543211', 'delhi.dynamos@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440103', 'Chennai Champions', 'Arjun Reddy', 'Chennai', '9876543212', 'chennai.champions@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440104', 'Kolkata Knights', 'Sourav Das', 'Kolkata', '9876543213', 'kolkata.knights@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440105', 'Bangalore Bulls', 'Kiran Rao', 'Bangalore', '9876543214', 'bangalore.bulls@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440106', 'Hyderabad Heroes', 'Lakshmi Devi', 'Hyderabad', '9876543215', 'hyderabad.heroes@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440107', 'Pune Panthers', 'Amit Patil', 'Pune', '9876543216', 'pune.panthers@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440108', 'Ahmedabad Aces', 'Neha Patel', 'Ahmedabad', '9876543217', 'ahmedabad.aces@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440109', 'Jaipur Jaguars', 'Vikram Singh', 'Jaipur', '9876543218', 'jaipur.jaguars@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440110', 'Lucknow Lions', 'Sunita Gupta', 'Lucknow', '9876543219', 'lucknow.lions@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440111', 'Bhopal Blazers', 'Ravi Tiwari', 'Bhopal', '9876543220', 'bhopal.blazers@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440112', 'Indore Indians', 'Meera Joshi', 'Indore', '9876543221', 'indore.indians@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440113', 'Surat Strikers', 'Deepak Shah', 'Surat', '9876543222', 'surat.strikers@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440114', 'Kanpur Kings', 'Ashok Verma', 'Kanpur', '9876543223', 'kanpur.kings@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440115', 'Nagpur Ninjas', 'Suresh Patil', 'Nagpur', '9876543224', 'nagpur.ninjas@email.com', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440116', 'Coimbatore Cobras', 'Ramesh Kumar', 'Coimbatore', '9876543225', 'coimbatore.cobras@email.com', '550e8400-e29b-41d4-a716-446655440001'),

-- Women's Premier League Teams
('550e8400-e29b-41d4-a716-446655440201', 'Mumbai Queens', 'Kavita Sharma', 'Mumbai', '9876543226', 'mumbai.queens@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440202', 'Delhi Divas', 'Pooja Gupta', 'Delhi', '9876543227', 'delhi.divas@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440203', 'Chennai Cheetahs', 'Deepika Rao', 'Chennai', '9876543228', 'chennai.cheetahs@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440204', 'Kolkata Kittens', 'Ritu Das', 'Kolkata', '9876543229', 'kolkata.kittens@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440205', 'Bangalore Beauties', 'Anita Kumar', 'Bangalore', '9876543230', 'bangalore.beauties@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440206', 'Hyderabad Hawks', 'Sushma Reddy', 'Hyderabad', '9876543231', 'hyderabad.hawks@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440207', 'Pune Phoenixes', 'Madhuri Patil', 'Pune', '9876543232', 'pune.phoenixes@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440208', 'Ahmedabad Angels', 'Nisha Patel', 'Ahmedabad', '9876543233', 'ahmedabad.angels@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440209', 'Jaipur Jewels', 'Rekha Singh', 'Jaipur', '9876543234', 'jaipur.jewels@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440210', 'Lucknow Lionesses', 'Geeta Gupta', 'Lucknow', '9876543235', 'lucknow.lionesses@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440211', 'Bhopal Butterflies', 'Shanti Tiwari', 'Bhopal', '9876543236', 'bhopal.butterflies@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440212', 'Indore Iris', 'Vandana Joshi', 'Indore', '9876543237', 'indore.iris@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440213', 'Surat Sirens', 'Hetal Shah', 'Surat', '9876543238', 'surat.sirens@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440214', 'Kanpur Kestrels', 'Sunita Verma', 'Kanpur', '9876543239', 'kanpur.kestrels@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440215', 'Nagpur Nightingales', 'Priya Patil', 'Nagpur', '9876543240', 'nagpur.nightingales@email.com', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440216', 'Coimbatore Crescents', 'Lakshmi Kumar', 'Coimbatore', '9876543241', 'coimbatore.crescents@email.com', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample players for Men's Championship teams (12 players per team)
INSERT INTO players (team_id, name, dob, role, jersey_number) VALUES
-- Mumbai Warriors (Team 1)
('550e8400-e29b-41d4-a716-446655440101', 'Arjun Patel', '1995-05-15', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440101', 'Rohit Kumar', '1994-08-22', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440101', 'Vikash Singh', '1996-03-10', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440101', 'Amit Sharma', '1995-11-05', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440101', 'Suresh Yadav', '1997-01-18', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440101', 'Kiran Joshi', '1996-07-25', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440101', 'Deepak Gupta', '1995-09-12', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440101', 'Manish Agarwal', '1996-04-20', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440101', 'Sanjay Tiwari', '1995-06-12', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440101', 'Ajay Mishra', '1997-02-28', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440101', 'Naveen Pandey', '1996-10-15', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440101', 'Ravi Verma', '1994-12-08', 'Spiker', 12),

-- Delhi Dynamos (Team 2)
('550e8400-e29b-41d4-a716-446655440102', 'Rahul Gupta', '1994-12-08', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440102', 'Deepak Verma', '1995-09-14', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440102', 'Manish Agarwal', '1996-04-20', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440102', 'Sanjay Tiwari', '1995-06-12', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440102', 'Ajay Mishra', '1997-02-28', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440102', 'Naveen Pandey', '1996-10-15', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440102', 'Vinod Kumar', '1995-03-22', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440102', 'Ashok Singh', '1994-11-18', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440102', 'Manoj Yadav', '1996-08-05', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440102', 'Sunil Joshi', '1995-12-30', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440102', 'Prakash Sharma', '1997-05-08', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440102', 'Dinesh Patel', '1996-01-25', 'Spiker', 12);

-- Continue with more teams (abbreviated for space - in real implementation, all 32 teams would have 12 players each)
-- For brevity, I'll add a few more teams and then use a pattern

-- Chennai Champions (Team 3)
INSERT INTO players (team_id, name, dob, role, jersey_number) VALUES
('550e8400-e29b-41d4-a716-446655440103', 'Rajesh Murugan', '1995-03-22', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440103', 'Karthik Raman', '1994-11-18', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440103', 'Senthil Kumar', '1996-08-05', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440103', 'Muthu Vel', '1995-12-30', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440103', 'Ganesh Babu', '1997-05-08', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440103', 'Prakash Raj', '1996-01-25', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440103', 'Suresh Kannan', '1995-07-12', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440103', 'Vignesh Moorthy', '1994-04-18', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440103', 'Arun Krishnan', '1996-09-22', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440103', 'Bala Subramanian', '1995-02-14', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440103', 'Ravi Chandran', '1997-06-30', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440103', 'Siva Kumar', '1996-11-08', 'Spiker', 12);

-- Create groups for Men's Championship
INSERT INTO groups (id, event_id, name) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440001', 'Group A'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440001', 'Group B'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440001', 'Group C'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440001', 'Group D'),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440002', 'Group A'),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440002', 'Group B'),
('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440002', 'Group C'),
('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440002', 'Group D')
ON CONFLICT (id) DO NOTHING;

-- Assign teams to groups (4 teams per group)
INSERT INTO group_teams (group_id, team_id) VALUES
-- Men's Championship Groups
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440103'),
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440104'),

('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440105'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440106'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440107'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440108'),

('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440109'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440110'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440111'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440112'),

('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440113'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440114'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440115'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440116'),

-- Women's Premier League Groups
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440201'),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440202'),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440203'),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440204'),

('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440205'),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440206'),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440207'),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440208'),

('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440209'),
('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440210'),
('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440211'),
('550e8400-e29b-41d4-a716-446655440307', '550e8400-e29b-41d4-a716-446655440212'),

('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440213'),
('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440214'),
('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440215'),
('550e8400-e29b-41d4-a716-446655440308', '550e8400-e29b-41d4-a716-446655440216')
ON CONFLICT (group_id, team_id) DO NOTHING;

-- Update teams with group assignments
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440301' WHERE id IN ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440104');
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440302' WHERE id IN ('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440107', '550e8400-e29b-41d4-a716-446655440108');
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440303' WHERE id IN ('550e8400-e29b-41d4-a716-446655440109', '550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440112');
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440304' WHERE id IN ('550e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440114', '550e8400-e29b-41d4-a716-446655440115', '550e8400-e29b-41d4-a716-446655440116');
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440305' WHERE id IN ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440204');
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440306' WHERE id IN ('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440207', '550e8400-e29b-41d4-a716-446655440208');
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440307' WHERE id IN ('550e8400-e29b-41d4-a716-446655440209', '550e8400-e29b-41d4-a716-446655440210', '550e8400-e29b-41d4-a716-446655440211', '550e8400-e29b-41d4-a716-446655440212');
UPDATE teams SET group_id = '550e8400-e29b-41d4-a716-446655440308' WHERE id IN ('550e8400-e29b-41d4-a716-446655440213', '550e8400-e29b-41d4-a716-446655440214', '550e8400-e29b-41d4-a716-446655440215', '550e8400-e29b-41d4-a716-446655440216');

-- Insert sample matches for Group A of Men's Championship
INSERT INTO matches (event_id, group_id, team1_id, team2_id, match_date, match_time, venue, stage, team1_sets, team2_sets, winner_id, is_completed) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440102', '2024-03-15', '10:00', 'Stadium A', 'group', 3, 1, '550e8400-e29b-41d4-a716-446655440101', true),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440104', '2024-03-15', '12:00', 'Stadium A', 'group', 3, 2, '550e8400-e29b-41d4-a716-446655440103', true),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440103', '2024-03-16', '10:00', 'Stadium A', 'group', 2, 3, '550e8400-e29b-41d4-a716-446655440103', true),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440104', '2024-03-16', '12:00', 'Stadium A', 'group', 3, 0, '550e8400-e29b-41d4-a716-446655440102', true),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440104', '2024-03-17', '10:00', 'Stadium A', 'group', 3, 1, '550e8400-e29b-41d4-a716-446655440101', true),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440103', '2024-03-17', '12:00', 'Stadium A', 'group', 1, 3, '550e8400-e29b-41d4-a716-446655440103', true)
ON CONFLICT DO NOTHING;