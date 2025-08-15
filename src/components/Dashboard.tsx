import React from 'react';
import { Users, Calendar, Trophy, Target, TrendingUp, Award, Plus, UserPlus, CalendarPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, teams, players, matches, registerTeamForEvent } = useData();

  const isAdmin = user?.role === 'admin';
  const userTeam = teams.find(team => team.id === user?.teamId);
  const userPlayers = players.filter(player => player.teamId === user?.teamId);
  const availableEvents = events.filter(event => 
    !userTeam?.eventId
  );

  const completedMatches = matches.filter(match => match.result);
  const upcomingMatches = matches.filter(match => !match.result);

  const adminStats = [
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'bg-blue-600' },
    { label: 'Registered Teams', value: teams.length, icon: Users, color: 'bg-green-600' },
    { label: 'Total Players', value: players.length, icon: Target, color: 'bg-purple-600' },
    { label: 'Matches Played', value: completedMatches.length, icon: Trophy, color: 'bg-orange-600' }
  ];

  const teamStats = [
    { label: 'Team Players', value: userPlayers.length, icon: Users, color: 'bg-blue-600' },
    { label: 'Events Registered', value: userTeam?.eventId ? 1 : 0, icon: Calendar, color: 'bg-green-600' },
    { label: 'Matches Played', value: completedMatches.filter(m => m.team1Id === user?.teamId || m.team2Id === user?.teamId).length, icon: Trophy, color: 'bg-purple-600' },
    { label: 'Upcoming Matches', value: upcomingMatches.filter(m => m.team1Id === user?.teamId || m.team2Id === user?.teamId).length, icon: TrendingUp, color: 'bg-orange-600' }
  ];

  const stats = isAdmin ? adminStats : teamStats;

  const quickActions = isAdmin ? [
    { label: 'Create Event', path: '/events', description: 'Set up a new Rollball tournament' },
    { label: 'Manage Groups', path: '/groups', description: 'Organize teams into groups' },
    { label: 'Schedule Matches', path: '/matches', description: 'Create and manage match fixtures' },
    { label: 'View Results', path: '/results', description: 'Track tournament progress and results' }
  ] : [
    { label: 'Register Team', path: '/team-registration', description: 'Complete your team registration' },
    { label: 'Manage Players', path: '/players', description: 'Add and manage team players' },
    { label: 'Register for Event', action: 'event-registration', description: 'Register your team for tournaments' }
  ];

  const handleEventRegistration = (eventId: string) => {
    if (userTeam) {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      // Validate team players against event requirements
      const teamPlayers = players.filter(p => p.teamId === userTeam.id);
      
      // Check gender requirements
      if (event.gender !== 'mixed') {
        const invalidGenderPlayers = teamPlayers.filter(p => p.sex !== event.gender);
        if (invalidGenderPlayers.length > 0) {
          alert(`This event is for ${event.gender} players only. Please ensure all players match the gender requirement.`);
          return;
        }
      }

      // Check age requirements
      if (event.minDob || event.maxDob) {
        const invalidAgePlayers = teamPlayers.filter(player => {
          const playerDob = new Date(player.dob);
          if (event.minDob && playerDob < new Date(event.minDob)) return true;
          if (event.maxDob && playerDob > new Date(event.maxDob)) return true;
          return false;
        });
        
        if (invalidAgePlayers.length > 0) {
          const ageRange = event.minDob && event.maxDob 
            ? `between ${new Date(event.minDob).toLocaleDateString()} and ${new Date(event.maxDob).toLocaleDateString()}`
            : event.minDob 
              ? `after ${new Date(event.minDob).toLocaleDateString()}`
              : `before ${new Date(event.maxDob!).toLocaleDateString()}`;
          alert(`Some players don't meet the age requirements. Players must be born ${ageRange}.`);
          return;
        }
      }

      registerTeamForEvent(userTeam.id, eventId)
        .then(() => {
          alert('Successfully registered for the event!');
        })
        .catch((error) => {
          console.error('Error registering for event:', error);
          alert('Failed to register for event. Please try again.');
        });
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-blue-100 text-lg">
              {isAdmin ? 'Manage your Rollball tournaments efficiently' : 'Track your team\'s tournament journey'}
            </p>
          </div>
          <div className="hidden md:block">
            <Award className="h-20 w-20 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            action.path ? (
              <Link
                key={index}
                to={action.path}
                className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 mb-2">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-blue-700">
                  {action.description}
                </p>
              </Link>
            ) : (
              <div
                key={index}
                className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => {
                  const eventSection = document.getElementById('event-registration-section');
                  eventSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 mb-2">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-blue-700">
                  {action.description}
                </p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Team Registration & Event Registration Section for Team Managers */}
      {!isAdmin && (
        <div className="space-y-6">
          {/* Team Registration Status */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Team Registration Status</h2>
            {!userTeam ? (
              <div className="text-center py-8">
                <UserPlus className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Register Your Team</h3>
                <p className="text-gray-600 mb-4">Complete your team registration to participate in tournaments</p>
                <Link
                  to="/team-registration"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Register Team
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-800">Team Registered</h3>
                  </div>
                  <p className="text-green-700 font-medium">{userTeam.teamName}</p>
                  <p className="text-sm text-green-600">Coach: {userTeam.coachName}</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-800">Players</h3>
                  </div>
                  <p className="text-blue-700 font-medium">{userPlayers.length}/12 Registered</p>
                  <Link to="/players" className="text-sm text-blue-600 hover:text-blue-800">
                    Manage Players →
                  </Link>
                </div>
                
                <div className={`border rounded-lg p-4 ${
                  userTeam.eventId 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-full mr-3 ${
                      userTeam.eventId 
                        ? 'bg-purple-100' 
                        : 'bg-yellow-100'
                    }`}>
                      <Trophy className={`h-5 w-5 ${
                        userTeam.eventId 
                          ? 'text-purple-600' 
                          : 'text-yellow-600'
                      }`} />
                    </div>
                    <h3 className={`font-semibold ${
                      userTeam.eventId 
                        ? 'text-purple-800' 
                        : 'text-yellow-800'
                    }`}>Event Status</h3>
                  </div>
                  {userTeam.eventId ? (
                    <div>
                      <p className="text-purple-700 font-medium">Registered</p>
                      <p className="text-sm text-purple-600">
                        {events.find(e => e.id === userTeam.eventId)?.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-yellow-700 font-medium">Not Registered</p>
                      <p className="text-sm text-yellow-600">Register for an event below</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Event Registration Section */}
          {userTeam && !userTeam.eventId && availableEvents.length > 0 && (
            <div id="event-registration-section" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Available Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableEvents.map((event) => {
                  const registeredTeams = teams.filter(team => team.eventId === event.id).length;
                  const isEventFull = registeredTeams >= event.maxTeams;
                  
                  return (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Trophy className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{event.name}</h3>
                          <p className="text-sm text-gray-600">{event.category}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium capitalize">{event.gender}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Teams:</span>
                          <span className={`font-medium ${isEventFull ? 'text-red-600' : 'text-green-600'}`}>
                            {registeredTeams}/{event.maxTeams}
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${isEventFull ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${(registeredTeams / event.maxTeams) * 100}%` }}
                        ></div>
                      </div>
                      
                      <button
                        onClick={() => handleEventRegistration(event.id)}
                        disabled={isEventFull || userPlayers.length < 6}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        {isEventFull ? 'Event Full' : userPlayers.length < 6 ? 'Need 6+ Players' : 'Register for Event'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Available Events */}
          {userTeam && !userTeam.eventId && availableEvents.length === 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Events Available</h3>
              <p className="text-gray-600">There are currently no events available for registration. Check back later!</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events (Admin) or Team Info (Team Manager) */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {isAdmin ? 'Recent Events' : 'Team Information'}
          </h2>
          {isAdmin ? (
            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{event.name}</h3>
                  <p className="text-sm text-gray-600">{event.category} - {event.gender}</p>
                  <p className="text-xs text-gray-500">Teams: {event.registeredTeams.length}/{event.maxTeams}</p>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-gray-500">No events created yet.</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {userTeam ? (
                <div>
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <h3 className="font-semibold text-blue-800">{userTeam.teamName}</h3>
                    <p className="text-sm text-blue-600">Coach: {userTeam.coachName}</p>
                    <p className="text-sm text-blue-600">District: {userTeam.district}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Players Registered: {userPlayers.length}/12</p>
                    <p>Event Status: {userTeam.eventId ? (
                      <span className="text-green-600 font-medium">
                        Registered for {events.find(e => e.id === userTeam.eventId)?.name}
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Not Registered</span>
                    )}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">Complete your team registration</p>
                  <Link
                    to="/team-registration"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register Team
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Matches</h2>
          <div className="space-y-3">
            {upcomingMatches.slice(0, 3).map((match) => {
              const team1 = teams.find(t => t.id === match.team1Id);
              const team2 = teams.find(t => t.id === match.team2Id);
              return (
                <div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">
                      {team1?.teamName} vs {team2?.teamName}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {match.stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{match.date} at {match.time}</p>
                  <p className="text-xs text-gray-500">Venue: {match.venue}</p>
                </div>
              );
            })}
            {upcomingMatches.length === 0 && (
              <p className="text-gray-500">No upcoming matches scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;