import React, { useState } from 'react';
import { Users, Plus, Save, Shuffle, AlertCircle, Trophy, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { exportGroupsToExcel, exportGroupsToPDF, exportGroupTeamsToExcel } from '../../utils/exportUtils';

const GroupManagement: React.FC = () => {
  const { events, teams, groups, players, matches, addGroup, assignTeamToGroup } = useData();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [groupAssignments, setGroupAssignments] = useState<{[teamId: string]: string}>({});
  const [existingAssignments, setExistingAssignments] = useState<{[teamId: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const eventTeams = teams.filter(team => team.eventId === selectedEventId);
  const eventGroups = groups.filter(group => group.eventId === selectedEventId);

  const generateGroupName = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    
    // Load existing group assignments for this event
    const eventTeamsData = teams.filter(team => team.eventId === eventId);
    const existing: {[teamId: string]: string} = {};
    const assignments: {[teamId: string]: string} = {};
    
    eventTeamsData.forEach(team => {
      if (team.groupId) {
        const group = groups.find(g => g.id === team.groupId);
        if (group) {
          const groupLetter = group.name.replace('Group ', '');
          existing[team.id] = groupLetter;
          assignments[team.id] = groupLetter;
        }
      }
    });
    
    setExistingAssignments(existing);
    setGroupAssignments(assignments);
    setSuccess('');
    setError('');
  };

  const handleTeamGroupChange = (teamId: string, groupName: string) => {
    setGroupAssignments(prev => ({
      ...prev,
      [teamId]: groupName
    }));
  };

  const autoAssignGroups = () => {
    if (eventTeams.length < 4) {
      setError('Need at least 4 teams to create groups');
      return;
    }

    const teamsPerGroup = Math.ceil(eventTeams.length / Math.ceil(eventTeams.length / 4));
    const numberOfGroups = Math.ceil(eventTeams.length / teamsPerGroup);
    
    const shuffledTeams = [...eventTeams].sort(() => Math.random() - 0.5);
    const newAssignments: {[teamId: string]: string} = {};

    shuffledTeams.forEach((team, index) => {
      const groupIndex = index % numberOfGroups;
      newAssignments[team.id] = generateGroupName(groupIndex);
    });

    setGroupAssignments(newAssignments);
    setError('');
  };

  const saveGroupAssignments = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate assignments
      const assignedTeams = Object.keys(groupAssignments).filter(teamId => groupAssignments[teamId]);
      if (assignedTeams.length !== eventTeams.length) {
        setError('All teams must be assigned to a group');
        setLoading(false);
        return;
      }

      // Check group sizes
      const groupCounts: {[groupName: string]: number} = {};
      Object.values(groupAssignments).forEach(groupName => {
        if (groupName) {
          groupCounts[groupName] = (groupCounts[groupName] || 0) + 1;
        }
      });

      const groupSizes = Object.values(groupCounts);
      if (groupSizes.some(size => size < 3 || size > 5)) {
        setError('Each group must have 3-5 teams');
        setLoading(false);
        return;
      }

      // Create groups and assign teams
      const uniqueGroups = [...new Set(Object.values(groupAssignments).filter(Boolean))];
      
      // Create new groups or use existing ones
      for (const groupName of uniqueGroups) {
        let groupId = '';
        
        // Check if group already exists
        const existingGroup = eventGroups.find(g => g.name === `Group ${groupName}`);
        if (existingGroup) {
          groupId = existingGroup.id;
        } else {
          // Create new group
          const groupTeams = eventTeams
            .filter(team => groupAssignments[team.id] === groupName)
            .map(team => team.id);
          
          await addGroup({
            eventId: selectedEventId,
            name: `Group ${groupName}`,
            teams: groupTeams
          });
          
          // Get the newly created group ID
          const newGroup = eventGroups.find(g => g.name === `Group ${groupName}`);
          groupId = newGroup?.id || '';
        }
        
        // Assign teams to this group
        const teamsInGroup = eventTeams.filter(team => groupAssignments[team.id] === groupName);
        for (const team of teamsInGroup) {
          if (existingAssignments[team.id] !== groupName) {
            await assignTeamToGroup(team.id, groupId);
          }
        }
      }

      setSuccess('Groups created and teams assigned successfully!');
    } catch (err) {
      setError('Failed to save group assignments. Please try again.');
    }
    
    setLoading(false);
  };

  const handleExportExcel = () => {
    if (!selectedEvent) return;
    exportGroupsToExcel(selectedEvent, eventGroups, eventTeams, eventMatches);
  };

  const handleExportPDF = () => {
    if (!selectedEvent) return;
    const eventMatches = matches.filter(match => match.eventId === selectedEventId);
    exportGroupsToPDF(selectedEvent, eventGroups, eventTeams, eventMatches);
  };

  const handleExportGroupTeams = (group: Group) => {
    if (!selectedEvent) return;
    exportGroupTeamsToExcel(group, teams, players, selectedEvent.name);
  };
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Group Management</h1>
            <p className="text-gray-600">Organize teams into groups for tournament play</p>
          </div>
          {selectedEventId && eventGroups.length > 0 && (
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

      {/* Event Selection */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const eventTeamCount = teams.filter(team => team.eventId === event.id).length;
            return (
              <div
                key={event.id}
                onClick={() => handleEventChange(event.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedEventId === event.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.category}</p>
                    <p className="text-xs text-gray-500">{eventTeamCount} teams registered</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No events available. Create an event first.</p>
          </div>
        )}
      </div>

      {/* Group Assignment */}
      {selectedEventId && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Assign Teams to Groups - {selectedEvent?.name}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={autoAssignGroups}
                disabled={eventTeams.length < 4}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Auto Assign
              </button>
              <button
                onClick={saveGroupAssignments}
                disabled={loading || Object.keys(groupAssignments).length === 0}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? 'Saving...' : 'Save Groups'}
              </button>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {eventTeams.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No teams registered for this event</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Group Assignment Guidelines:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Each group should have 3-5 teams</li>
                  <li>• Teams in the same group will play against each other (round-robin)</li>
                  <li>• Top 2 teams from each group will qualify for knockout stage</li>
                  <li>• Use "Auto Assign" for random balanced distribution</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventTeams.map((team) => (
                  <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        existingAssignments[team.id] ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Users className={`h-5 w-5 ${
                          existingAssignments[team.id] ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{team.teamName}</h3>
                        <p className="text-sm text-gray-600">Coach: {team.coachName}</p>
                        <p className="text-xs text-gray-500">{team.district}</p>
                        {existingAssignments[team.id] && (
                          <p className="text-xs text-green-600 font-medium">
                            Currently in Group {existingAssignments[team.id]}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign to Group:
                      </label>
                      <select
                        value={groupAssignments[team.id] || ''}
                        onChange={(e) => handleTeamGroupChange(team.id, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Group</option>
                        {Array.from({ length: Math.min(8, Math.ceil(eventTeams.length / 3)) }, (_, i) => (
                          <option key={i} value={generateGroupName(i)}>
                            Group {generateGroupName(i)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Preview */}
              {Object.keys(groupAssignments).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from(new Set(Object.values(groupAssignments).filter(Boolean))).map(groupName => {
                      const groupTeams = eventTeams.filter(team => groupAssignments[team.id] === groupName);
                      return (
                        <div key={groupName} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Group {groupName}</h4>
                          <div className="space-y-2">
                            {groupTeams.map(team => (
                              <div key={team.id} className="text-sm text-gray-600 flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                {team.teamName}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            {groupTeams.length} teams
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Existing Groups */}
      {selectedEventId && eventGroups.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Current Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventGroups.map((group) => {
              const groupTeams = teams.filter(team => group.teams.includes(team.id));
              return (
                <div key={group.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{group.name}</h3>
                    <button
                      onClick={() => handleExportGroupTeams(group)}
                      className="flex items-center px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </button>
                  </div>
                  <div className="space-y-2">
                    {groupTeams.map(team => (
                      <div key={team.id} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {team.teamName}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {groupTeams.length} teams
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;