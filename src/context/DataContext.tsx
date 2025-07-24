import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Event, 
  Team, 
  Player, 
  Group, 
  Match, 
  MatchResult, 
  DataContextType 
} from '../types';
import { 
  mockEvents, 
  mockTeams, 
  mockPlayers, 
  mockGroups, 
  mockMatches 
} from '../data/mockData';

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
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');

    // Use mock data if no stored data exists
    setEvents(storedEvents.length > 0 ? storedEvents : mockEvents);
    setTeams(storedTeams.length > 0 ? storedTeams : mockTeams);
    setPlayers(storedPlayers.length > 0 ? storedPlayers : mockPlayers);
    setGroups(storedGroups.length > 0 ? storedGroups : mockGroups);
    setMatches(storedMatches.length > 0 ? storedMatches : mockMatches);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (events.length > 0) localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (teams.length > 0) localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    if (players.length > 0) localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    if (groups.length > 0) localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  const addEvent = (eventData: Omit<Event, 'id' | 'registeredTeams'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      registeredTeams: []
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
  };

  const addTeam = (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
  };

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: Date.now().toString()
    };
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
  };

  const addGroup = (groupData: Omit<Group, 'id'>) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now().toString()
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
  };

  const addMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: Date.now().toString()
    };
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
  };

  const updateMatch = (matchId: string, result: MatchResult) => {
    const updatedMatches = matches.map(match =>
      match.id === matchId ? { ...match, result } : match
    );
    setMatches(updatedMatches);
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
  };

  const assignTeamToGroup = (teamId: string, groupId: string) => {
    const updatedTeams = teams.map(team =>
      team.id === teamId ? { ...team, groupId } : team
    );
    setTeams(updatedTeams);
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