import React, { createContext, useContext, useState, useEffect } from 'react';

interface Event {
  id: string;
  name: string;
  category: string;
  gender: 'male' | 'female' | 'mixed';
  startDate: string;
  endDate: string;
  maxTeams: number;
  registeredTeams: string[];
}

interface Team {
  id: string;
  teamName: string;
  coachName: string;
  district: string;
  mobile: string;
  email: string;
  eventId?: string;
  groupId?: string;
}

interface Player {
  id: string;
  teamId: string;
  name: string;
  dob: string;
  role: string;
  jerseyNumber: number;
  photo?: string;
  aadhar?: string;
}

interface Group {
  id: string;
  eventId: string;
  name: string;
  teams: string[];
}

interface Match {
  id: string;
  eventId: string;
  groupId?: string;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  venue: string;
  result?: {
    team1Sets: number;
    team2Sets: number;
    winnerId: string;
  };
  stage: 'group' | 'quarterfinal' | 'semifinal' | 'final';
}

interface DataContextType {
  events: Event[];
  teams: Team[];
  players: Player[];
  groups: Group[];
  matches: Match[];
  addEvent: (event: Omit<Event, 'id' | 'registeredTeams'>) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  addGroup: (group: Omit<Group, 'id'>) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (matchId: string, result: Match['result']) => void;
  registerTeamForEvent: (teamId: string, eventId: string) => void;
  assignTeamToGroup: (teamId: string, groupId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Load data from localStorage
    setEvents(JSON.parse(localStorage.getItem('events') || '[]'));
    setTeams(JSON.parse(localStorage.getItem('teams') || '[]'));
    setPlayers(JSON.parse(localStorage.getItem('players') || '[]'));
    setGroups(JSON.parse(localStorage.getItem('groups') || '[]'));
    setMatches(JSON.parse(localStorage.getItem('matches') || '[]'));
  }, []);

  const addEvent = (eventData: Omit<Event, 'id' | 'registeredTeams'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      registeredTeams: []
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const addTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString()
    };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: Date.now().toString()
    };
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  };

  const addGroup = (groupData: Omit<Group, 'id'>) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now().toString()
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
  };

  const addMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: Date.now().toString()
    };
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
  };

  const updateMatch = (matchId: string, result: Match['result']) => {
    const updatedMatches = matches.map(match =>
      match.id === matchId ? { ...match, result } : match
    );
    setMatches(updatedMatches);
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
  };

  const registerTeamForEvent = (teamId: string, eventId: string) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, registeredTeams: [...(event.registeredTeams || []), teamId] }
        : event
    );
    const updatedTeams = teams.map(team =>
      team.id === teamId ? { ...team, eventId } : team
    );
    setEvents(updatedEvents);
    setTeams(updatedTeams);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  const assignTeamToGroup = (teamId: string, groupId: string) => {
    const updatedTeams = teams.map(team =>
      team.id === teamId ? { ...team, groupId } : team
    );
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  return (
    <DataContext.Provider value={{
      events,
      teams,
      players,
      groups,
      matches,
      addEvent,
      addTeam,
      addPlayer,
      addGroup,
      addMatch,
      updateMatch,
      registerTeamForEvent,
      assignTeamToGroup
    }}>
      {children}
    </DataContext.Provider>
  );
};