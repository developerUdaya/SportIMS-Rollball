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
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getCurrentUser } from '../lib/supabase';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEvents(),
        fetchTeams(),
        fetchPlayers(),
        fetchGroups(),
        fetchMatches()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      const formattedEvents: Event[] = (data || []).map(event => ({
        id: event.id,
        name: event.name,
        category: event.category,
        gender: event.gender,
        startDate: event.start_date,
        endDate: event.end_date,
        maxTeams: event.max_teams,
        registeredTeams: [], // Will be populated from teams data
        minDob: event.min_dob,
        maxDob: event.max_dob
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      setEvents([]);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }

      const formattedTeams: Team[] = (data || []).map(team => ({
        id: team.id,
        teamName: team.team_name,
        coachName: team.coach_name,
        district: team.district,
        mobile: team.mobile,
        email: team.email,
        password: '', // Don't expose password
        eventId: team.event_id,
        groupId: team.group_id,
        createdAt: team.created_at
      }));

      setTeams(formattedTeams);
    } catch (error) {
      console.error('Error in fetchTeams:', error);
      setTeams([]);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('jersey_number', { ascending: true });

      if (error) {
        console.error('Error fetching players:', error);
        return;
      }

      const formattedPlayers: Player[] = (data || []).map(player => ({
        id: player.id,
        teamId: player.team_id,
        name: player.name,
        fatherName: player.father_name || '',
        dob: player.dob,
        role: player.role,
        jerseyNumber: player.jersey_number,
        photo: player.photo,
        aadhar: player.aadhar,
        aadharCertificate: player.aadhar_certificate,
        birthCertificate: player.birth_certificate,
        irbfCertificate: player.irbf_certificate,
        address: player.address || '',
        email: player.email || '',
        mobile: player.mobile || '',
        irbfNo: player.irbf_no || '',
        sex: player.sex || 'male',
        schoolCollege: player.school_college || '',
        district: player.district || ''
      }));

      setPlayers(formattedPlayers);
    } catch (error) {
      console.error('Error in fetchPlayers:', error);
      setPlayers([]);
    }
  };

  const fetchGroups = async () => {
    try {
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('name', { ascending: true });

      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        return;
      }

      const { data: groupTeamsData, error: groupTeamsError } = await supabase
        .from('group_teams')
        .select('*');

      if (groupTeamsError) {
        console.error('Error fetching group teams:', groupTeamsError);
        return;
      }

      const formattedGroups: Group[] = (groupsData || []).map(group => ({
        id: group.id,
        eventId: group.event_id,
        name: group.name,
        teams: (groupTeamsData || [])
          .filter(gt => gt.group_id === group.id)
          .map(gt => gt.team_id)
      }));

      setGroups(formattedGroups);
    } catch (error) {
      console.error('Error in fetchGroups:', error);
      setGroups([]);
    }
  };

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      const formattedMatches: Match[] = (data || []).map(match => ({
        id: match.id,
        eventId: match.event_id,
        groupId: match.group_id,
        team1Id: match.team1_id,
        team2Id: match.team2_id,
        date: match.match_date,
        time: match.match_time,
        venue: match.venue,
        stage: match.stage,
        result: match.is_completed ? {
          team1Sets: match.team1_sets,
          team2Sets: match.team2_sets,
          winnerId: match.winner_id!
        } : undefined
      }));

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error in fetchMatches:', error);
      setMatches([]);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'registeredTeams'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert({
        name: eventData.name,
        category: eventData.category,
        gender: eventData.gender,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        max_teams: eventData.maxTeams,
        min_dob: eventData.minDob,
        max_dob: eventData.maxDob,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding event:', error);
      throw error;
    }

    const newEvent: Event = {
      id: data.id,
      name: data.name,
      category: data.category,
      gender: data.gender,
      startDate: data.start_date,
      endDate: data.end_date,
      maxTeams: data.max_teams,
      registeredTeams: [],
      minDob: data.min_dob,
      maxDob: data.max_dob
    };

    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = async (eventId: string, eventData: Omit<Event, 'id' | 'registeredTeams'>) => {
    const { data, error } = await supabase
      .from('events')
      .update({
        name: eventData.name,
        category: eventData.category,
        gender: eventData.gender,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        max_teams: eventData.maxTeams,
        min_dob: eventData.minDob,
        max_dob: eventData.maxDob
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }

    const updatedEvent: Event = {
      id: data.id,
      name: data.name,
      category: data.category,
      gender: data.gender,
      startDate: data.start_date,
      endDate: data.end_date,
      maxTeams: data.max_teams,
      registeredTeams: teams.filter(team => team.eventId === eventId).map(team => team.id),
      minDob: data.min_dob,
      maxDob: data.max_dob
    };

    setEvents(prev => prev.map(event => 
      event.id === eventId ? updatedEvent : event
    ));
  };

  const deleteMatch = async (matchId: string) => {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);

    if (error) {
      console.error('Error deleting match:', error);
      throw error;
    }

    setMatches(prev => prev.filter(match => match.id !== matchId));
  };
  const addTeam = async (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const currentUser = getCurrentUser();
    
    const { data, error } = await supabase
      .from('teams')
      .insert({
        team_name: teamData.teamName,
        coach_name: teamData.coachName,
        district: teamData.district,
        mobile: teamData.mobile,
        email: teamData.email,
        event_id: teamData.eventId,
        group_id: teamData.groupId
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding team:', error);
      throw error;
    }

    const newTeam: Team = {
      id: data.id,
      teamName: data.team_name,
      coachName: data.coach_name,
      district: data.district,
      mobile: data.mobile,
      email: data.email,
      password: '',
      eventId: data.event_id,
      groupId: data.group_id,
      createdAt: data.created_at
    };

    setTeams(prev => [newTeam, ...prev]);
    
    // Update user's team_id
    if (currentUser) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ team_id: data.id })
        .eq('id', currentUser.id);
        
      if (!updateError) {
        // Update localStorage
        const updatedUser = { ...currentUser, team_id: data.id };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  const addPlayer = async (playerData: Omit<Player, 'id'>) => {
    const { data, error } = await supabase
      .from('players')
      .insert({
        team_id: playerData.teamId,
        name: playerData.name,
        father_name: playerData.fatherName,
        dob: playerData.dob,
        role: playerData.role,
        jersey_number: playerData.jerseyNumber,
        photo: playerData.photo,
        aadhar: playerData.aadhar,
        aadhar_certificate: playerData.aadharCertificate,
        birth_certificate: playerData.birthCertificate,
        irbf_certificate: playerData.irbfCertificate,
        address: playerData.address,
        email: playerData.email,
        mobile: playerData.mobile,
        irbf_no: playerData.irbfNo,
        sex: playerData.sex,
        school_college: playerData.schoolCollege,
        district: playerData.district
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding player:', error);
      throw error;
    }

    const newPlayer: Player = {
      id: data.id,
      teamId: data.team_id,
      name: data.name,
      fatherName: data.father_name || '',
      dob: data.dob,
      role: data.role,
      jerseyNumber: data.jersey_number,
      photo: data.photo,
      aadhar: data.aadhar,
      aadharCertificate: data.aadhar_certificate,
      birthCertificate: data.birth_certificate,
      irbfCertificate: data.irbf_certificate,
      address: data.address || '',
      email: data.email || '',
      mobile: data.mobile || '',
      irbfNo: data.irbf_no || '',
      sex: data.sex || 'male',
      schoolCollege: data.school_college || '',
      district: data.district || ''
    };

    setPlayers(prev => [...prev, newPlayer]);
  };

  const updatePlayer = async (playerId: string, playerData: Omit<Player, 'id' | 'teamId'>) => {
    const { data, error } = await supabase
      .from('players')
      .update({
        name: playerData.name,
        father_name: playerData.fatherName,
        dob: playerData.dob,
        role: playerData.role,
        jersey_number: playerData.jerseyNumber,
        photo: playerData.photo,
        aadhar: playerData.aadhar,
        aadhar_certificate: playerData.aadharCertificate,
        birth_certificate: playerData.birthCertificate,
        irbf_certificate: playerData.irbfCertificate,
        address: playerData.address,
        email: playerData.email,
        mobile: playerData.mobile,
        irbf_no: playerData.irbfNo,
        sex: playerData.sex,
        school_college: playerData.schoolCollege,
        district: playerData.district
      })
      .eq('id', playerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating player:', error);
      throw error;
    }

    const updatedPlayer: Player = {
      id: data.id,
      teamId: data.team_id,
      name: data.name,
      fatherName: data.father_name || '',
      dob: data.dob,
      role: data.role,
      jerseyNumber: data.jersey_number,
      photo: data.photo,
      aadhar: data.aadhar,
      aadharCertificate: data.aadhar_certificate,
      birthCertificate: data.birth_certificate,
      irbfCertificate: data.irbf_certificate,
      address: data.address || '',
      email: data.email || '',
      mobile: data.mobile || '',
      irbfNo: data.irbf_no || '',
      sex: data.sex || 'male',
      schoolCollege: data.school_college || '',
      district: data.district || ''
    };

    setPlayers(prev => prev.map(player =>
      player.id === playerId ? updatedPlayer : player
    ));
  };

  const deletePlayer = async (playerId: string) => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId);

    if (error) {
      console.error('Error deleting player:', error);
      throw error;
    }

    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };
  const addGroup = async (groupData: Omit<Group, 'id'>) => {
    const { data, error } = await supabase
      .from('groups')
      .insert({
        event_id: groupData.eventId,
        name: groupData.name
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding group:', error);
      throw error;
    }

    // Add team associations
    if (groupData.teams.length > 0) {
      const groupTeamInserts = groupData.teams.map(teamId => ({
        group_id: data.id,
        team_id: teamId
      }));

      const { error: groupTeamsError } = await supabase
        .from('group_teams')
        .insert(groupTeamInserts);

      if (groupTeamsError) {
        console.error('Error adding group teams:', groupTeamsError);
      }
    }

    const newGroup: Group = {
      id: data.id,
      eventId: data.event_id,
      name: data.name,
      teams: groupData.teams
    };

    setGroups(prev => [...prev, newGroup]);
  };

  const addMatch = async (matchData: Omit<Match, 'id'>) => {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        event_id: matchData.eventId,
        group_id: matchData.groupId,
        team1_id: matchData.team1Id,
        team2_id: matchData.team2Id,
        match_date: matchData.date,
        match_time: matchData.time,
        venue: matchData.venue,
        stage: matchData.stage
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding match:', error);
      throw error;
    }

    const newMatch: Match = {
      id: data.id,
      eventId: data.event_id,
      groupId: data.group_id,
      team1Id: data.team1_id,
      team2Id: data.team2_id,
      date: data.match_date,
      time: data.match_time,
      venue: data.venue,
      stage: data.stage,
      result: undefined
    };

    setMatches(prev => [...prev, newMatch]);
  };

  const updateMatch = async (matchId: string, result: MatchResult) => {
    const { error } = await supabase
      .from('matches')
      .update({
        team1_sets: result.team1Sets,
        team2_sets: result.team2Sets,
        winner_id: result.winnerId,
        is_completed: true
      })
      .eq('id', matchId);

    if (error) {
      console.error('Error updating match:', error);
      throw error;
    }

    setMatches(prev => prev.map(match =>
      match.id === matchId ? { ...match, result } : match
    ));
  };

  const registerTeamForEvent = async (teamId: string, eventId: string) => {
    const { error } = await supabase
      .from('teams')
      .update({ event_id: eventId })
      .eq('id', teamId);

    if (error) {
      console.error('Error registering team for event:', error);
      throw error;
    }

    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, eventId } : team
    ));
  };

  const assignTeamToGroup = async (teamId: string, groupId: string) => {
    // Check if team is already assigned to a group
    const { data: existingAssignment } = await supabase
      .from('group_teams')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (existingAssignment) {
      // Update existing assignment
      const { error: updateError } = await supabase
        .from('group_teams')
        .update({ group_id: groupId })
        .eq('team_id', teamId);

      if (updateError) {
        console.error('Error updating team group assignment:', updateError);
        throw updateError;
      }
    } else {
      // Create new assignment
      const { error: insertError } = await supabase
        .from('group_teams')
        .insert({ group_id: groupId, team_id: teamId });

      if (insertError) {
        console.error('Error creating team group assignment:', insertError);
        throw insertError;
      }
    }

    // Update team's group_id
    const { error: teamError } = await supabase
      .from('teams')
      .update({ group_id: groupId })
      .eq('id', teamId);

    if (teamError) {
      console.error('Error assigning team to group:', teamError);
      throw teamError;
    }

    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, groupId } : team
    ));

    // Refresh groups data
    fetchGroups();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{
      events,
        updatePlayer,
        deletePlayer,
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
      updateEvent,
      deleteMatch,
      registerTeamForEvent,
      assignTeamToGroup
    }}>
      {children}
    </DataContext.Provider>
  );
};