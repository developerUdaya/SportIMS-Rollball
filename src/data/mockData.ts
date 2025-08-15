import { Event, Team, Player, Group, Match } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'State Championship 2024',
    category: 'Senior Men',
    gender: 'male',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    maxTeams: 16,
    registeredTeams: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: '2',
    name: 'Women\'s Premier League',
    category: 'Senior Women',
    gender: 'female',
    startDate: '2024-04-10',
    endDate: '2024-04-15',
    maxTeams: 12,
    registeredTeams: ['13', '14', '15', '16', '17', '18']
  },
  {
    id: '3',
    name: 'Youth Championship U19',
    category: 'U19 Boys',
    gender: 'male',
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    maxTeams: 8,
    registeredTeams: ['19', '20', '21', '22']
  }
];

export const mockTeams: Team[] = [
  {
    id: '1',
    teamName: 'Mumbai Warriors',
    coachName: 'Rajesh Kumar',
    district: 'Mumbai',
    mobile: '9876543210',
    email: 'mumbai.warriors@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    teamName: 'Delhi Dynamos',
    coachName: 'Priya Sharma',
    district: 'Delhi',
    mobile: '9876543211',
    email: 'delhi.dynamos@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '1',
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    teamName: 'Chennai Champions',
    coachName: 'Arjun Reddy',
    district: 'Chennai',
    mobile: '9876543212',
    email: 'chennai.champions@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '1',
    createdAt: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    teamName: 'Kolkata Knights',
    coachName: 'Sourav Das',
    district: 'Kolkata',
    mobile: '9876543213',
    email: 'kolkata.knights@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '2',
    createdAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    teamName: 'Bangalore Bulls',
    coachName: 'Kiran Rao',
    district: 'Bangalore',
    mobile: '9876543214',
    email: 'bangalore.bulls@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '2',
    createdAt: '2024-01-19T10:00:00Z'
  },
  {
    id: '6',
    teamName: 'Hyderabad Heroes',
    coachName: 'Lakshmi Devi',
    district: 'Hyderabad',
    mobile: '9876543215',
    email: 'hyderabad.heroes@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '2',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '7',
    teamName: 'Pune Panthers',
    coachName: 'Amit Patil',
    district: 'Pune',
    mobile: '9876543216',
    email: 'pune.panthers@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '3',
    createdAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '8',
    teamName: 'Ahmedabad Aces',
    coachName: 'Neha Patel',
    district: 'Ahmedabad',
    mobile: '9876543217',
    email: 'ahmedabad.aces@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '3',
    createdAt: '2024-01-22T10:00:00Z'
  },
  {
    id: '9',
    teamName: 'Jaipur Jaguars',
    coachName: 'Vikram Singh',
    district: 'Jaipur',
    mobile: '9876543218',
    email: 'jaipur.jaguars@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '3',
    createdAt: '2024-01-23T10:00:00Z'
  },
  {
    id: '10',
    teamName: 'Lucknow Lions',
    coachName: 'Sunita Gupta',
    district: 'Lucknow',
    mobile: '9876543219',
    email: 'lucknow.lions@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '4',
    createdAt: '2024-01-24T10:00:00Z'
  },
  {
    id: '11',
    teamName: 'Bhopal Blazers',
    coachName: 'Ravi Tiwari',
    district: 'Bhopal',
    mobile: '9876543220',
    email: 'bhopal.blazers@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '4',
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '12',
    teamName: 'Indore Indians',
    coachName: 'Meera Joshi',
    district: 'Indore',
    mobile: '9876543221',
    email: 'indore.indians@email.com',
    password: 'team123',
    eventId: '1',
    groupId: '4',
    createdAt: '2024-01-26T10:00:00Z'
  },
  // Women's teams
  {
    id: '13',
    teamName: 'Mumbai Queens',
    coachName: 'Kavita Sharma',
    district: 'Mumbai',
    mobile: '9876543222',
    email: 'mumbai.queens@email.com',
    password: 'team123',
    eventId: '2',
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '14',
    teamName: 'Delhi Divas',
    coachName: 'Pooja Gupta',
    district: 'Delhi',
    mobile: '9876543223',
    email: 'delhi.divas@email.com',
    password: 'team123',
    eventId: '2',
    createdAt: '2024-02-02T10:00:00Z'
  },
  {
    id: '15',
    teamName: 'Chennai Cheetahs',
    coachName: 'Deepika Rao',
    district: 'Chennai',
    mobile: '9876543224',
    email: 'chennai.cheetahs@email.com',
    password: 'team123',
    eventId: '2',
    createdAt: '2024-02-03T10:00:00Z'
  },
  {
    id: '16',
    teamName: 'Kolkata Kittens',
    coachName: 'Ritu Das',
    district: 'Kolkata',
    mobile: '9876543225',
    email: 'kolkata.kittens@email.com',
    password: 'team123',
    eventId: '2',
    createdAt: '2024-02-04T10:00:00Z'
  },
  {
    id: '17',
    teamName: 'Bangalore Beauties',
    coachName: 'Anita Kumar',
    district: 'Bangalore',
    mobile: '9876543226',
    email: 'bangalore.beauties@email.com',
    password: 'team123',
    eventId: '2',
    createdAt: '2024-02-05T10:00:00Z'
  },
  {
    id: '18',
    teamName: 'Hyderabad Hawks',
    coachName: 'Sushma Reddy',
    district: 'Hyderabad',
    mobile: '9876543227',
    email: 'hyderabad.hawks@email.com',
    password: 'team123',
    eventId: '2',
    createdAt: '2024-02-06T10:00:00Z'
  },
  // Youth teams
  {
    id: '19',
    teamName: 'Mumbai Juniors',
    coachName: 'Rohit Sharma',
    district: 'Mumbai',
    mobile: '9876543228',
    email: 'mumbai.juniors@email.com',
    password: 'team123',
    eventId: '3',
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    id: '20',
    teamName: 'Delhi Cadets',
    coachName: 'Vikas Gupta',
    district: 'Delhi',
    mobile: '9876543229',
    email: 'delhi.cadets@email.com',
    password: 'team123',
    eventId: '3',
    createdAt: '2024-02-11T10:00:00Z'
  },
  {
    id: '21',
    teamName: 'Chennai Colts',
    coachName: 'Suresh Kumar',
    district: 'Chennai',
    mobile: '9876543230',
    email: 'chennai.colts@email.com',
    password: 'team123',
    eventId: '3',
    createdAt: '2024-02-12T10:00:00Z'
  },
  {
    id: '22',
    teamName: 'Kolkata Cubs',
    coachName: 'Debasis Roy',
    district: 'Kolkata',
    mobile: '9876543231',
    email: 'kolkata.cubs@email.com',
    password: 'team123',
    eventId: '3',
    createdAt: '2024-02-13T10:00:00Z'
  }
];

export const mockPlayers: Player[] = [
  // Mumbai Warriors players
  { id: '1', teamId: '1', name: 'Arjun Patel', dob: '1995-05-15', role: 'Spiker', jerseyNumber: 1, photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '2', teamId: '1', name: 'Rohit Kumar', dob: '1994-08-22', role: 'Libero', jerseyNumber: 2, photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '3', teamId: '1', name: 'Vikash Singh', dob: '1996-03-10', role: 'Setter', jerseyNumber: 3, photo: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '4', teamId: '1', name: 'Amit Sharma', dob: '1995-11-05', role: 'Middle Blocker', jerseyNumber: 4, photo: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '5', teamId: '1', name: 'Suresh Yadav', dob: '1997-01-18', role: 'Outside Hitter', jerseyNumber: 5, photo: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '6', teamId: '1', name: 'Kiran Joshi', dob: '1996-07-25', role: 'Opposite Hitter', jerseyNumber: 6, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  
  // Delhi Dynamos players
  { id: '7', teamId: '2', name: 'Rahul Gupta', dob: '1994-12-08', role: 'Spiker', jerseyNumber: 1, photo: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '8', teamId: '2', name: 'Deepak Verma', dob: '1995-09-14', role: 'Libero', jerseyNumber: 2, photo: 'https://images.pexels.com/photos/1043475/pexels-photo-1043475.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '9', teamId: '2', name: 'Manish Agarwal', dob: '1996-04-20', role: 'Setter', jerseyNumber: 3, photo: 'https://images.pexels.com/photos/1040884/pexels-photo-1040884.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '10', teamId: '2', name: 'Sanjay Tiwari', dob: '1995-06-12', role: 'Middle Blocker', jerseyNumber: 4, photo: 'https://images.pexels.com/photos/1043476/pexels-photo-1043476.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '11', teamId: '2', name: 'Ajay Mishra', dob: '1997-02-28', role: 'Outside Hitter', jerseyNumber: 5, photo: 'https://images.pexels.com/photos/1040885/pexels-photo-1040885.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '12', teamId: '2', name: 'Naveen Pandey', dob: '1996-10-15', role: 'Opposite Hitter', jerseyNumber: 6, photo: 'https://images.pexels.com/photos/1043477/pexels-photo-1043477.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },

  // Chennai Champions players
  { id: '13', teamId: '3', name: 'Rajesh Murugan', dob: '1995-03-22', role: 'Spiker', jerseyNumber: 1, photo: 'https://images.pexels.com/photos/1040886/pexels-photo-1040886.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '14', teamId: '3', name: 'Karthik Raman', dob: '1994-11-18', role: 'Libero', jerseyNumber: 2, photo: 'https://images.pexels.com/photos/1043478/pexels-photo-1043478.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '15', teamId: '3', name: 'Senthil Kumar', dob: '1996-08-05', role: 'Setter', jerseyNumber: 3, photo: 'https://images.pexels.com/photos/1040887/pexels-photo-1040887.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '16', teamId: '3', name: 'Muthu Vel', dob: '1995-12-30', role: 'Middle Blocker', jerseyNumber: 4, photo: 'https://images.pexels.com/photos/1043479/pexels-photo-1043479.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '17', teamId: '3', name: 'Ganesh Babu', dob: '1997-05-08', role: 'Outside Hitter', jerseyNumber: 5, photo: 'https://images.pexels.com/photos/1040888/pexels-photo-1040888.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '18', teamId: '3', name: 'Prakash Raj', dob: '1996-01-25', role: 'Opposite Hitter', jerseyNumber: 6, photo: 'https://images.pexels.com/photos/1043480/pexels-photo-1043480.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },

  // Add more players for other teams (abbreviated for brevity)
  { id: '19', teamId: '4', name: 'Sourav Ghosh', dob: '1995-07-12', role: 'Spiker', jerseyNumber: 1 },
  { id: '20', teamId: '4', name: 'Abhijit Roy', dob: '1994-04-18', role: 'Libero', jerseyNumber: 2 },
  { id: '21', teamId: '4', name: 'Subrata Das', dob: '1996-09-22', role: 'Setter', jerseyNumber: 3 },
  { id: '22', teamId: '4', name: 'Tapas Sen', dob: '1995-02-14', role: 'Middle Blocker', jerseyNumber: 4 },
  { id: '23', teamId: '4', name: 'Ranjan Pal', dob: '1997-06-30', role: 'Outside Hitter', jerseyNumber: 5 },
  { id: '24', teamId: '4', name: 'Biswajit Kar', dob: '1996-11-08', role: 'Opposite Hitter', jerseyNumber: 6 },

  // Women's team players
  { id: '25', teamId: '13', name: 'Priya Nair', dob: '1996-03-15', role: 'Spiker', jerseyNumber: 1, photo: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '26', teamId: '13', name: 'Sneha Patil', dob: '1995-08-22', role: 'Libero', jerseyNumber: 2, photo: 'https://images.pexels.com/photos/1065085/pexels-photo-1065085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '27', teamId: '13', name: 'Kavya Sharma', dob: '1997-01-10', role: 'Setter', jerseyNumber: 3, photo: 'https://images.pexels.com/photos/1065086/pexels-photo-1065086.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '28', teamId: '13', name: 'Riya Joshi', dob: '1996-05-18', role: 'Middle Blocker', jerseyNumber: 4, photo: 'https://images.pexels.com/photos/1065087/pexels-photo-1065087.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '29', teamId: '13', name: 'Ananya Singh', dob: '1998-02-25', role: 'Outside Hitter', jerseyNumber: 5, photo: 'https://images.pexels.com/photos/1065088/pexels-photo-1065088.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '30', teamId: '13', name: 'Meera Rao', dob: '1997-07-12', role: 'Opposite Hitter', jerseyNumber: 6, photo: 'https://images.pexels.com/photos/1065089/pexels-photo-1065089.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
];

export const mockGroups: Group[] = [
  {
    id: '1',
    eventId: '1',
    name: 'Group A',
    teams: ['1', '2', '3']
  },
  {
    id: '2',
    eventId: '1',
    name: 'Group B',
    teams: ['4', '5', '6']
  },
  {
    id: '3',
    eventId: '1',
    name: 'Group C',
    teams: ['7', '8', '9']
  },
  {
    id: '4',
    eventId: '1',
    name: 'Group D',
    teams: ['10', '11', '12']
  }
];

export const mockMatches: Match[] = [
  // Group A matches
  {
    id: '1',
    eventId: '1',
    groupId: '1',
    team1Id: '1',
    team2Id: '2',
    date: '2024-03-15',
    time: '10:00',
    venue: 'Stadium A',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 1,
      winnerId: '1'
    }
  },
  {
    id: '2',
    eventId: '1',
    groupId: '1',
    team1Id: '1',
    team2Id: '3',
    date: '2024-03-16',
    time: '14:00',
    venue: 'Stadium A',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 2,
      winnerId: '1'
    }
  },
  {
    id: '3',
    eventId: '1',
    groupId: '1',
    team1Id: '2',
    team2Id: '3',
    date: '2024-03-17',
    time: '16:00',
    venue: 'Stadium A',
    stage: 'group',
    result: {
      team1Sets: 2,
      team2Sets: 3,
      winnerId: '3'
    }
  },
  // Group B matches
  {
    id: '4',
    eventId: '1',
    groupId: '2',
    team1Id: '4',
    team2Id: '5',
    date: '2024-03-15',
    time: '12:00',
    venue: 'Stadium B',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 0,
      winnerId: '4'
    }
  },
  {
    id: '5',
    eventId: '1',
    groupId: '2',
    team1Id: '4',
    team2Id: '6',
    date: '2024-03-16',
    time: '10:00',
    venue: 'Stadium B',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 1,
      winnerId: '4'
    }
  },
  {
    id: '6',
    eventId: '1',
    groupId: '2',
    team1Id: '5',
    team2Id: '6',
    date: '2024-03-17',
    time: '12:00',
    venue: 'Stadium B',
    stage: 'group',
    result: {
      team1Sets: 1,
      team2Sets: 3,
      winnerId: '6'
    }
  },
  // Group C matches
  {
    id: '7',
    eventId: '1',
    groupId: '3',
    team1Id: '7',
    team2Id: '8',
    date: '2024-03-15',
    time: '14:00',
    venue: 'Stadium C',
    stage: 'group',
    result: {
      team1Sets: 2,
      team2Sets: 3,
      winnerId: '8'
    }
  },
  {
    id: '8',
    eventId: '1',
    groupId: '3',
    team1Id: '7',
    team2Id: '9',
    date: '2024-03-16',
    time: '16:00',
    venue: 'Stadium C',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 1,
      winnerId: '7'
    }
  },
  {
    id: '9',
    eventId: '1',
    groupId: '3',
    team1Id: '8',
    team2Id: '9',
    date: '2024-03-17',
    time: '18:00',
    venue: 'Stadium C',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 2,
      winnerId: '8'
    }
  },
  // Group D matches
  {
    id: '10',
    eventId: '1',
    groupId: '4',
    team1Id: '10',
    team2Id: '11',
    date: '2024-03-15',
    time: '16:00',
    venue: 'Stadium D',
    stage: 'group',
    result: {
      team1Sets: 1,
      team2Sets: 3,
      winnerId: '11'
    }
  },
  {
    id: '11',
    eventId: '1',
    groupId: '4',
    team1Id: '10',
    team2Id: '12',
    date: '2024-03-16',
    time: '18:00',
    venue: 'Stadium D',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 2,
      winnerId: '10'
    }
  },
  {
    id: '12',
    eventId: '1',
    groupId: '4',
    team1Id: '11',
    team2Id: '12',
    date: '2024-03-17',
    time: '20:00',
    venue: 'Stadium D',
    stage: 'group',
    result: {
      team1Sets: 3,
      team2Sets: 0,
      winnerId: '11'
    }
  },
  // Upcoming matches
  {
    id: '13',
    eventId: '1',
    groupId: '1',
    team1Id: '1',
    team2Id: '2',
    date: '2024-03-20',
    time: '10:00',
    venue: 'Main Stadium',
    stage: 'semifinal'
  },
  {
    id: '14',
    eventId: '1',
    groupId: '2',
    team1Id: '4',
    team2Id: '8',
    date: '2024-03-20',
    time: '14:00',
    venue: 'Main Stadium',
    stage: 'semifinal'
  }
];