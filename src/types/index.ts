export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team_manager';
  teamId?: string;
}

export interface Event {
  id: string;
  name: string;
  category: string;
  gender: 'male' | 'female' | 'mixed';
  startDate: string;
  endDate: string;
  maxTeams: number;
  registeredTeams: string[];
  minDob?: string;
  maxDob?: string;
}

export interface Team {
  id: string;
  teamName: string;
  coachName: string;
  district: string;
  mobile: string;
  email: string;
  password: string;
  eventId?: string;
  groupId?: string;
  createdAt: string;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  fatherName: string;
  dob: string;
  role: string;
  jerseyNumber: number;
  photo?: string;
  aadhar?: string;
  aadharCertificate?: string;
  birthCertificate?: string;
  irbfCertificate?: string;
  address: string;
  email: string;
  mobile: string;
  irbfNo: string;
  sex: 'male' | 'female';
  schoolCollege: string;
  district: string;
}

export interface Group {
  id: string;
  eventId: string;
  name: string;
  teams: string[];
}

export interface MatchResult {
  team1Sets: number;
  team2Sets: number;
  winnerId: string;
}

export interface Match {
  id: string;
  eventId: string;
  groupId?: string;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  venue: string;
  result?: MatchResult;
  stage: 'group' | 'quarterfinal' | 'semifinal' | 'final';
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  setsWon: number;
  setsLost: number;
  setRatio: number;
  groupName?: string;
  district: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<Team, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
}

export interface DataContextType {
  events: Event[];
  teams: Team[];
  players: Player[];
  groups: Group[];
  matches: Match[];
  addEvent: (event: Omit<Event, 'id' | 'registeredTeams'>) => void;
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (playerId: string, player: Omit<Player, 'id' | 'teamId'>) => void;
  deletePlayer: (playerId: string) => void;
  addGroup: (group: Omit<Group, 'id'>) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (matchId: string, result: MatchResult) => void;
  updateEvent: (eventId: string, eventData: Omit<Event, 'id' | 'registeredTeams'>) => void;
  deleteMatch: (matchId: string) => void;
  registerTeamForEvent: (teamId: string, eventId: string) => void;
  assignTeamToGroup: (teamId: string, groupId: string) => void;
}

export interface PlayerFormData {
  name: string;
  fatherName: string;
  dob: string;
  role: string;
  jerseyNumber: number;
  photo?: string;
  aadhar?: string;
  aadharCertificate?: string;
  birthCertificate?: string;
  irbfCertificate?: string;
  address: string;
  email: string;
  mobile: string;
  irbfNo: string;
  sex: 'male' | 'female';
  schoolCollege: string;
  district: string;
}

export interface EventFormData {
  name: string;
  category: string;
  gender: 'male' | 'female' | 'mixed';
  startDate: string;
  endDate: string;
  maxTeams: number;
  minDob?: string;
  maxDob?: string;
}

export interface MatchFormData {
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  venue: string;
  stage: 'group' | 'quarterfinal' | 'semifinal' | 'final';
}

export interface TeamFormData {
  teamName: string;
  coachName: string;
  district: string;
  mobile: string;
  email: string;
}

export interface RegisterFormData extends TeamFormData {
  password: string;
  confirmPassword: string;
}