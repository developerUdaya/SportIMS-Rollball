/*
  # Add remaining sample players for all teams

  This migration adds 12 players for each of the remaining teams
  to complete the sample data with 2 events, 32 teams, and 384 players total.
*/

-- Add players for remaining Men's Championship teams (Teams 4-16)
INSERT INTO players (team_id, name, dob, role, jersey_number) VALUES
-- Kolkata Knights (Team 4)
('550e8400-e29b-41d4-a716-446655440104', 'Sourav Ghosh', '1995-07-12', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440104', 'Abhijit Roy', '1994-04-18', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440104', 'Subrata Das', '1996-09-22', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440104', 'Tapas Sen', '1995-02-14', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440104', 'Ranjan Pal', '1997-06-30', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440104', 'Biswajit Kar', '1996-11-08', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440104', 'Debasis Mitra', '1995-03-25', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440104', 'Partha Sarkar', '1994-08-15', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440104', 'Anirban Bose', '1996-12-03', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440104', 'Sandip Dutta', '1995-05-20', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440104', 'Kaushik Banerjee', '1997-01-10', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440104', 'Prosenjit Mondal', '1996-07-28', 'Spiker', 12),

-- Bangalore Bulls (Team 5)
('550e8400-e29b-41d4-a716-446655440105', 'Kiran Rao', '1995-04-15', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440105', 'Suresh Gowda', '1994-09-22', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440105', 'Ravi Kumar', '1996-06-10', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440105', 'Prasad Reddy', '1995-11-28', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440105', 'Naveen Shetty', '1997-03-18', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440105', 'Arun Nair', '1996-08-05', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440105', 'Vinay Hegde', '1995-12-12', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440105', 'Mohan Pai', '1994-07-30', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440105', 'Girish Bhat', '1996-02-25', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440105', 'Santosh Rao', '1995-10-08', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440105', 'Mahesh Kamath', '1997-04-22', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440105', 'Rajesh Shenoy', '1996-09-15', 'Spiker', 12),

-- Hyderabad Heroes (Team 6)
('550e8400-e29b-41d4-a716-446655440106', 'Venkat Reddy', '1995-06-18', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440106', 'Srinivas Rao', '1994-11-25', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440106', 'Krishna Murthy', '1996-04-12', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440106', 'Ramesh Babu', '1995-09-30', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440106', 'Sunil Kumar', '1997-01-15', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440106', 'Praveen Chandra', '1996-06-28', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440106', 'Mahesh Goud', '1995-11-10', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440106', 'Naresh Yadav', '1994-08-22', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440106', 'Ravi Teja', '1996-03-05', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440106', 'Sai Kumar', '1995-12-18', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440106', 'Vamsi Krishna', '1997-05-02', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440106', 'Chandra Sekhar', '1996-10-25', 'Spiker', 12);

-- Continue with remaining teams (abbreviated for space - in production, all teams would have full rosters)
-- For the remaining teams, I'll add a representative sample

-- Add players for all Women's teams (Teams 17-32)
INSERT INTO players (team_id, name, dob, role, jersey_number) VALUES
-- Mumbai Queens (Team 17)
('550e8400-e29b-41d4-a716-446655440201', 'Priya Nair', '1996-03-15', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440201', 'Sneha Patil', '1995-08-22', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440201', 'Kavya Sharma', '1997-01-10', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440201', 'Riya Joshi', '1996-05-18', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440201', 'Ananya Singh', '1998-02-25', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440201', 'Meera Rao', '1997-07-12', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440201', 'Divya Gupta', '1995-11-30', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440201', 'Pooja Verma', '1994-06-08', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440201', 'Shruti Agarwal', '1996-09-15', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440201', 'Neha Tiwari', '1995-04-22', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440201', 'Ritika Mishra', '1997-12-05', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440201', 'Sakshi Pandey', '1996-08-18', 'Spiker', 12),

-- Delhi Divas (Team 18)
('550e8400-e29b-41d4-a716-446655440202', 'Anjali Gupta', '1995-05-20', 'Spiker', 1),
('550e8400-e29b-41d4-a716-446655440202', 'Simran Kaur', '1994-10-12', 'Libero', 2),
('550e8400-e29b-41d4-a716-446655440202', 'Preeti Sharma', '1996-07-28', 'Setter', 3),
('550e8400-e29b-41d4-a716-446655440202', 'Nidhi Agarwal', '1995-12-15', 'Middle Blocker', 4),
('550e8400-e29b-41d4-a716-446655440202', 'Komal Verma', '1997-03-08', 'Outside Hitter', 5),
('550e8400-e29b-41d4-a716-446655440202', 'Swati Jain', '1996-08-25', 'Opposite Hitter', 6),
('550e8400-e29b-41d4-a716-446655440202', 'Manisha Singh', '1995-01-18', 'Spiker', 7),
('550e8400-e29b-41d4-a716-446655440202', 'Deepika Yadav', '1994-09-30', 'Defensive Specialist', 8),
('550e8400-e29b-41d4-a716-446655440202', 'Ritu Malhotra', '1996-04-12', 'Middle Blocker', 9),
('550e8400-e29b-41d4-a716-446655440202', 'Sonia Kapoor', '1995-11-05', 'Outside Hitter', 10),
('550e8400-e29b-41d4-a716-446655440202', 'Priyanka Goel', '1997-06-22', 'Setter', 11),
('550e8400-e29b-41d4-a716-446655440202', 'Tanvi Saxena', '1996-02-08', 'Spiker', 12);

-- For brevity, I'll add a few more key teams and use a pattern for the rest
-- In a real implementation, all 32 teams would have complete 12-player rosters

-- Add a bulk insert for remaining players using a pattern
-- This is a simplified approach - in production, you'd want unique, realistic names for all players

DO $$
DECLARE
    team_record RECORD;
    player_roles TEXT[] := ARRAY['Spiker', 'Libero', 'Setter', 'Middle Blocker', 'Outside Hitter', 'Opposite Hitter', 'Defensive Specialist'];
    male_names TEXT[] := ARRAY['Rahul', 'Amit', 'Suresh', 'Ravi', 'Kiran', 'Deepak', 'Manoj', 'Sanjay', 'Vinod', 'Ashok', 'Prakash', 'Dinesh'];
    female_names TEXT[] := ARRAY['Priya', 'Sneha', 'Kavya', 'Riya', 'Ananya', 'Meera', 'Divya', 'Pooja', 'Shruti', 'Neha', 'Ritika', 'Sakshi'];
    surnames TEXT[] := ARRAY['Kumar', 'Singh', 'Sharma', 'Gupta', 'Patel', 'Yadav', 'Verma', 'Agarwal', 'Joshi', 'Tiwari', 'Mishra', 'Pandey'];
    i INTEGER;
    player_name TEXT;
    birth_year INTEGER;
    birth_month INTEGER;
    birth_day INTEGER;
    birth_date DATE;
BEGIN
    -- Loop through all teams that don't have 12 players yet
    FOR team_record IN 
        SELECT t.id, t.team_name, e.gender
        FROM teams t
        JOIN events e ON t.event_id = e.id
        WHERE (SELECT COUNT(*) FROM players p WHERE p.team_id = t.id) < 12
    LOOP
        -- Add players to reach 12 per team
        FOR i IN (SELECT COUNT(*) FROM players WHERE team_id = team_record.id) + 1..12 LOOP
            -- Generate random birth date between 1994-1998
            birth_year := 1994 + (i % 5);
            birth_month := 1 + (i % 12);
            birth_day := 1 + (i % 28);
            birth_date := make_date(birth_year, birth_month, birth_day);
            
            -- Generate player name based on gender
            IF team_record.gender = 'male' THEN
                player_name := male_names[1 + (i % array_length(male_names, 1))] || ' ' || surnames[1 + (i % array_length(surnames, 1))];
            ELSE
                player_name := female_names[1 + (i % array_length(female_names, 1))] || ' ' || surnames[1 + (i % array_length(surnames, 1))];
            END IF;
            
            -- Insert player
            INSERT INTO players (team_id, name, dob, role, jersey_number)
            VALUES (
                team_record.id,
                player_name,
                birth_date,
                player_roles[1 + ((i-1) % array_length(player_roles, 1))],
                i
            );
        END LOOP;
    END LOOP;
END $$;