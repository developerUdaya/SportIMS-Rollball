import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Save, Trophy, Users, AlertCircle, FileSpreadsheet, FileText, Download, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { MatchFormData, Event, Group, Team, Match } from '../../types';
import { exportMatchesToExcel, exportMatchesToPDF, exportMatchTeamsWithPlayersToPDF } from '../../utils/exportUtils';

const MatchScheduling: React.FC = () => {
  const { events, teams, groups, matches, players, addMatch, updateMatch, deleteMatch } = useData();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MatchFormData>({
    team1Id: '',
    team2Id: '',
    date: '',
    time: '',
    venue: '',
    stage: 'group'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedEvent: Event | undefined = events.find(e => e.id === selectedEventId);
  const eventGroups: Group[] = groups.filter(group => group.eventId === selectedEventId);
  const selectedGroup: Group | undefined = groups.find(g => g.id === selectedGroupId);
  const groupTeams: Team[] = selectedGroup ? teams.filter(team => selectedGroup.teams.includes(team.id)) : [];
  const eventMatches: Match[] = matches.filter(match => match.eventId === selectedEventId);
  const groupMatches: Match[] = selectedGroupId ? eventMatches.filter(match => match.groupId === selectedGroupId) : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRoundRobinMatches = () => {
    if (!selectedGroup || groupTeams.length < 2) {
      setError('Need at least 2 teams in the group');
      return;
    }

    const newMatches: Omit<Match, 'id'>[] = [];
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        newMatches.push({
          team1Id: groupTeams[i].id,
          team2Id: groupTeams[j].id,
          eventId: selectedEventId,
          groupId: selectedGroupId,
          date: '',
          time: '',
          venue: '',
          stage: 'group' as const
        });
      }
    }

    // Add all matches
    newMatches.forEach(match => addMatch(match));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.team1Id === formData.team2Id) {
        setError('Teams cannot play against themselves');
        setLoading(false);
        return;
      }

      // Check if match already exists
      const existingMatch: Match | undefined = groupMatches.find(match => 
        (match.team1Id === formData.team1Id && match.team2Id === formData.team2Id) ||
        (match.team1Id === formData.team2Id && match.team2Id === formData.team1Id)
      );

      if (existingMatch) {
        setError('Match between these teams already exists');
        setLoading(false);
        return;
      }

      await addMatch({
        ...formData,
        eventId: selectedEventId,
        groupId: selectedGroupId
      });

      // Reset form
      setFormData({
        team1Id: '',
        team2Id: '',
        date: '',
        time: '',
        venue: '',
        stage: 'group'
      });
      setShowForm(false);
    } catch (err) {
      setError('Failed to schedule match. Please try again.');
    }
    
    setLoading(false);
  };

  const handleResultUpdate = (matchId: string, team1Sets: number, team2Sets: number) => {
    if (team1Sets < 0 || team2Sets < 0) return;

    const match: Match | undefined = matches.find(m => m.id === matchId);
    if (!match) return;
    
    const winnerId = team1Sets > team2Sets ? match.team1Id : match.team2Id;
    
    updateMatch(matchId, {
      team1Sets,
      team2Sets,
      winnerId
    });
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await deleteMatch(matchId);
      } catch (error) {
        console.error('Error deleting match:', error);
        setError('Failed to delete match. Please try again.');
      }
    }
  };

  const handleExportExcel = () => {
    if (!selectedEvent) return;
    exportMatchesToExcel(selectedEvent, eventMatches, teams, eventGroups);
  };

  const handleExportPDF = () => {
    if (!selectedEvent) return;
    exportMatchesToPDF(selectedEvent, eventMatches, teams, eventGroups);
  };

  const handleExportMatchTeams = async (match: Match) => {
    if (!selectedEvent) return;
    await exportMatchTeamsWithPlayersToPDF(match, teams, players, selectedEvent.name);
  };
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Match Scheduling</h1>
            <p className="text-gray-600">Schedule and manage tournament matches</p>
          </div>
          {selectedEventId && eventMatches.length > 0 && (
            <div className="flex space-x-3">
              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Export Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event & Group Selection */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Event & Group</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSelectedGroupId('');
              }}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              disabled={!selectedEventId}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">Select Group</option>
              {eventGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Management */}
      {selectedGroupId && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedGroup?.name} Matches
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={generateRoundRobinMatches}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Generate Round Robin
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Match
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Add Match Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule New Match</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team 1</label>
                    <select
                      name="team1Id"
                      required
                      value={formData.team1Id}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Team 1</option>
                      {groupTeams.map(team => (
                        <option key={team.id} value={team.id}>{team.teamName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team 2</label>
                    <select
                      name="team2Id"
                      required
                      value={formData.team2Id}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Team 2</option>
                      {groupTeams.filter(team => team.id !== formData.team1Id).map(team => (
                        <option key={team.id} value={team.id}>{team.teamName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="venue"
                        required
                        value={formData.venue}
                        onChange={handleInputChange}
                        placeholder="Enter venue"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loading ? 'Scheduling...' : 'Schedule Match'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Matches List */}
          <div className="space-y-4">
            {groupMatches.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No matches scheduled yet</p>
                <button
                  onClick={generateRoundRobinMatches}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Generate Round Robin Matches
                </button>
              </div>
            ) : (
              groupMatches.map((match) => {
                const team1 = teams.find(t => t.id === match.team1Id);
                const team2 = teams.find(t => t.id === match.team2Id);
                
                return (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-semibold text-gray-800">{team1?.teamName}</p>
                          <p className="text-sm text-gray-600">Team 1</p>
                        </div>
                        <div className="text-2xl font-bold text-gray-400">VS</div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-800">{team2?.teamName}</p>
                          <p className="text-sm text-gray-600">Team 2</p>
                        </div>
                      </div>
                      
                      {match.result ? (
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {match.result.team1Sets} - {match.result.team2Sets}
                          </div>
                          <p className="text-sm text-gray-600">Final Score</p>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="3"
                            defaultValue={match.result?.team1Sets || ''}
                            placeholder="Sets"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            onChange={(e) => {
                              const team2Input = e.target.parentElement?.querySelector('input:nth-child(3)') as HTMLInputElement;
                              const team2Sets = parseInt(team2Input?.value || '0');
                              const team1Sets = parseInt(e.target.value || '0');
                              if (!isNaN(team1Sets) && !isNaN(team2Sets)) {
                                handleResultUpdate(match.id, team1Sets, team2Sets);
                              }
                            }}
                          />
                          <span className="py-1">-</span>
                          <input
                            type="number"
                            min="0"
                            max="3"
                            defaultValue={match.result?.team2Sets || ''}
                            placeholder="Sets"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            onChange={(e) => {
                              const team1Input = e.target.parentElement?.querySelector('input:nth-child(1)') as HTMLInputElement;
                              const team1Sets = parseInt(team1Input?.value || '0');
                              const team2Sets = parseInt(e.target.value || '0');
                              if (!isNaN(team1Sets) && !isNaN(team2Sets)) {
                                handleResultUpdate(match.id, team1Sets, team2Sets);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-4">
                        {match.date && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                        )}
                        {match.time && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {match.time}
                          </div>
                        )}
                        {match.venue && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {match.venue}
                          </div>
                        )}
                      </div>
                      
                      <span className={`px-2 py-1 rounded text-xs ${
                        match.result 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {match.result ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleDeleteMatch(match.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                      
                      <button
                        onClick={() => handleExportMatchTeams(match)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export Teams
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScheduling;