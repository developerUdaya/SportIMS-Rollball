import React, { useState } from 'react';
import { Trophy, Download, Users, Calendar, Medal, Target, BarChart3, FileSpreadsheet, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { exportResultsToExcel, exportResultsToPDF, exportGroupsToExcel, exportGroupsToPDF, exportMatchesToExcel, exportMatchesToPDF } from '../../utils/exportUtils';

const Results: React.FC = () => {
  const { events, teams, groups, matches, players } = useData();
  const [selectedEventId, setSelectedEventId] = useState('');

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const eventTeams = teams.filter(team => team.eventId === selectedEventId);
  const eventGroups = groups.filter(group => group.eventId === selectedEventId);
  const eventMatches = matches.filter(match => match.eventId === selectedEventId);
  const eventPlayers = players.filter(player => 
    eventTeams.some(team => team.id === player.teamId)
  );

  const calculateGroupStandings = (groupId: string) => {
    const group = eventGroups.find(g => g.id === groupId);
    if (!group) return [];

    const groupTeams = teams.filter(team => group.teams.includes(team.id));
    const groupMatches = eventMatches.filter(match => match.groupId === groupId && match.result);

    return groupTeams.map(team => {
      let wins = 0;
      let losses = 0;
      let setsWon = 0;
      let setsLost = 0;
      let matchesPlayed = 0;

      groupMatches.forEach(match => {
        if (match.team1Id === team.id || match.team2Id === team.id) {
          matchesPlayed++;
          if (match.result?.winnerId === team.id) {
            wins++;
          } else {
            losses++;
          }

          if (match.team1Id === team.id) {
            setsWon += match.result?.team1Sets || 0;
            setsLost += match.result?.team2Sets || 0;
          } else {
            setsWon += match.result?.team2Sets || 0;
            setsLost += match.result?.team1Sets || 0;
          }
        }
      });

      return {
        ...team,
        matchesPlayed,
        wins,
        losses,
        points: wins * 2,
        setsWon,
        setsLost,
        setRatio: setsLost > 0 ? (setsWon / setsLost).toFixed(2) : setsWon.toString()
      };
    }).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return parseFloat(b.setRatio) - parseFloat(a.setRatio);
    });
  };

  const getOverallStats = () => {
    const totalMatches = eventMatches.length;
    const completedMatches = eventMatches.filter(match => match.result).length;
    const upcomingMatches = totalMatches - completedMatches;

    return {
      totalTeams: eventTeams.length,
      totalPlayers: eventPlayers.length,
      totalGroups: eventGroups.length,
      totalMatches,
      completedMatches,
      upcomingMatches
    };
  };

  const downloadResults = (type: string) => {
    let content = '';
    let filename = '';

    switch (type) {
      case 'teams':
        content = generateTeamsReport();
        filename = `${selectedEvent?.name}_teams.txt`;
        break;
      case 'groups':
        content = generateGroupsReport();
        filename = `${selectedEvent?.name}_groups.txt`;
        break;
      case 'matches':
        content = generateMatchesReport();
        filename = `${selectedEvent?.name}_matches.txt`;
        break;
      case 'final':
        content = generateFinalReport();
        filename = `${selectedEvent?.name}_final_results.txt`;
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = (type: string) => {
    if (!selectedEvent) return;
    
    switch (type) {
      case 'results':
        exportResultsToExcel(selectedEvent, eventTeams, eventPlayers, eventGroups, eventMatches);
        break;
      case 'groups':
        exportGroupsToExcel(selectedEvent, eventGroups, eventTeams, eventMatches);
        break;
      case 'matches':
        exportMatchesToExcel(selectedEvent, eventMatches, teams, eventGroups);
        break;
    }
  };

  const handleExportPDF = (type: string) => {
    if (!selectedEvent) return;
    
    switch (type) {
      case 'results':
        exportResultsToPDF(selectedEvent, eventTeams, eventPlayers, eventGroups, eventMatches);
        break;
      case 'groups':
        exportGroupsToPDF(selectedEvent, eventGroups, eventTeams, eventMatches);
        break;
      case 'matches':
        exportMatchesToPDF(selectedEvent, eventMatches, teams, eventGroups);
        break;
    }
  };

  const generateTeamsReport = () => {
    let report = `${selectedEvent?.name} - Teams Report\n`;
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;
    report += `Total Teams: ${eventTeams.length}\n\n`;

    eventTeams.forEach((team, index) => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      report += `${index + 1}. ${team.teamName}\n`;
      report += `   Coach: ${team.coachName}\n`;
      report += `   District: ${team.district}\n`;
      report += `   Contact: ${team.mobile} | ${team.email}\n`;
      report += `   Players: ${teamPlayers.length}\n\n`;
    });

    return report;
  };

  const generateGroupsReport = () => {
    let report = `${selectedEvent?.name} - Group Standings\n`;
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;

    eventGroups.forEach(group => {
      const standings = calculateGroupStandings(group.id);
      report += `${group.name}\n`;
      report += `${'='.repeat(group.name.length)}\n`;
      report += `Pos | Team Name                | MP | W | L | Pts | Sets | Ratio\n`;
      report += `${'-'.repeat(65)}\n`;

      standings.forEach((team, index) => {
        const pos = (index + 1).toString().padEnd(3);
        const name = team.teamName.padEnd(24);
        const mp = team.matchesPlayed.toString().padEnd(2);
        const w = team.wins.toString().padEnd(1);
        const l = team.losses.toString().padEnd(1);
        const pts = team.points.toString().padEnd(3);
        const sets = `${team.setsWon}-${team.setsLost}`.padEnd(6);
        const ratio = team.setRatio.padEnd(5);
        
        report += `${pos} | ${name} | ${mp} | ${w} | ${l} | ${pts} | ${sets} | ${ratio}\n`;
      });
      report += `\n`;
    });

    return report;
  };

  const generateMatchesReport = () => {
    let report = `${selectedEvent?.name} - Match Results\n`;
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;

    eventGroups.forEach(group => {
      const groupMatches = eventMatches.filter(match => match.groupId === group.id);
      report += `${group.name} Matches\n`;
      report += `${'='.repeat(group.name.length + 8)}\n`;

      groupMatches.forEach(match => {
        const team1 = teams.find(t => t.id === match.team1Id);
        const team2 = teams.find(t => t.id === match.team2Id);
        
        report += `${team1?.teamName} vs ${team2?.teamName}\n`;
        if (match.result) {
          report += `Result: ${match.result.team1Sets} - ${match.result.team2Sets}\n`;
          const winner = teams.find(t => t.id === match.result?.winnerId);
          report += `Winner: ${winner?.teamName}\n`;
        } else {
          report += `Status: Scheduled\n`;
        }
        if (match.date) report += `Date: ${match.date}\n`;
        if (match.time) report += `Time: ${match.time}\n`;
        if (match.venue) report += `Venue: ${match.venue}\n`;
        report += `\n`;
      });
    });

    return report;
  };

  const generateFinalReport = () => {
    let report = `${selectedEvent?.name} - Final Tournament Report\n`;
    report += `${'='.repeat(selectedEvent?.name.length + 25)}\n`;
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;

    const stats = getOverallStats();
    report += `TOURNAMENT STATISTICS\n`;
    report += `${'-'.repeat(20)}\n`;
    report += `Total Teams: ${stats.totalTeams}\n`;
    report += `Total Players: ${stats.totalPlayers}\n`;
    report += `Total Groups: ${stats.totalGroups}\n`;
    report += `Total Matches: ${stats.totalMatches}\n`;
    report += `Completed Matches: ${stats.completedMatches}\n`;
    report += `Completion Rate: ${((stats.completedMatches / stats.totalMatches) * 100).toFixed(1)}%\n\n`;

    // Add group standings
    report += `GROUP STANDINGS\n`;
    report += `${'-'.repeat(15)}\n`;
    eventGroups.forEach(group => {
      const standings = calculateGroupStandings(group.id);
      report += `\n${group.name}:\n`;
      standings.forEach((team, index) => {
        const qualified = index < 2 ? ' (QUALIFIED)' : '';
        report += `  ${index + 1}. ${team.teamName} - ${team.points} pts${qualified}\n`;
      });
    });

    return report;
  };

  const stats = selectedEventId ? getOverallStats() : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Tournament Results</h1>
            <p className="text-gray-600">View comprehensive tournament statistics and download reports</p>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Event Selection */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
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
                  <p className="text-xs text-gray-500">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Statistics */}
      {selectedEventId && stats && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Tournament Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{stats.totalTeams}</div>
              <div className="text-sm text-blue-600">Teams</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{stats.totalPlayers}</div>
              <div className="text-sm text-green-600">Players</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Medal className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{stats.totalGroups}</div>
              <div className="text-sm text-purple-600">Groups</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{stats.totalMatches}</div>
              <div className="text-sm text-orange-600">Total Matches</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-800">{stats.completedMatches}</div>
              <div className="text-sm text-emerald-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-800">
                {stats.totalMatches > 0 ? Math.round((stats.completedMatches / stats.totalMatches) * 100) : 0}%
              </div>
              <div className="text-sm text-yellow-600">Complete</div>
            </div>
          </div>
        </div>
      )}

      {/* Download Reports */}
      {selectedEventId && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Export Reports</h2>
          <div className="space-y-6">
            {/* Text Reports */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Text Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => downloadResults('teams')}
                  className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">Teams List</div>
                    <div className="text-sm text-gray-600">All registered teams</div>
                  </div>
                </button>

                <button
                  onClick={() => downloadResults('groups')}
                  className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                >
                  <Medal className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">Group Tables</div>
                    <div className="text-sm text-gray-600">Standings & points</div>
                  </div>
                </button>

                <button
                  onClick={() => downloadResults('matches')}
                  className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
                >
                  <Trophy className="h-6 w-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">Match Results</div>
                    <div className="text-sm text-gray-600">All match details</div>
                  </div>
                </button>

                <button
                  onClick={() => downloadResults('final')}
                  className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-all"
                >
                  <Download className="h-6 w-6 text-yellow-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">Final Report</div>
                    <div className="text-sm text-gray-600">Complete summary</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Excel Reports */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Excel Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleExportExcel('results')}
                  className="flex items-center justify-center p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                >
                  <FileSpreadsheet className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-green-800">Complete Results</div>
                    <div className="text-sm text-green-600">Teams, players & summary</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportExcel('groups')}
                  className="flex items-center justify-center p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                >
                  <FileSpreadsheet className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-green-800">Group Standings</div>
                    <div className="text-sm text-green-600">Detailed group tables</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportExcel('matches')}
                  className="flex items-center justify-center p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                >
                  <FileSpreadsheet className="h-6 w-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-green-800">Match Results</div>
                    <div className="text-sm text-green-600">All matches by stage</div>
                  </div>
                </button>
              </div>
            </div>

            {/* PDF Reports */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">PDF Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleExportPDF('results')}
                  className="flex items-center justify-center p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                >
                  <FileText className="h-6 w-6 text-red-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-red-800">Complete Results</div>
                    <div className="text-sm text-red-600">Tournament summary</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportPDF('groups')}
                  className="flex items-center justify-center p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                >
                  <FileText className="h-6 w-6 text-red-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-red-800">Group Standings</div>
                    <div className="text-sm text-red-600">Formatted standings</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportPDF('matches')}
                  className="flex items-center justify-center p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                >
                  <FileText className="h-6 w-6 text-red-600 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-red-800">Match Results</div>
                    <div className="text-sm text-red-600">Professional format</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Download Reports - keeping for backward compatibility */}
      {selectedEventId && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Legacy Text Downloads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => downloadResults('teams')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Teams List</div>
                <div className="text-sm text-gray-600">All registered teams</div>
              </div>
            </button>

            <button
              onClick={() => downloadResults('groups')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
            >
              <Medal className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Group Tables</div>
                <div className="text-sm text-gray-600">Standings & points</div>
              </div>
            </button>

            <button
              onClick={() => downloadResults('matches')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              <Trophy className="h-6 w-6 text-purple-600 mr-3" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Match Results</div>
                <div className="text-sm text-gray-600">All match details</div>
              </div>
            </button>

            <button
              onClick={() => downloadResults('final')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-all"
            >
              <Download className="h-6 w-6 text-yellow-600 mr-3" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Final Report</div>
                <div className="text-sm text-gray-600">Complete summary</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Group Standings */}
      {selectedEventId && eventGroups.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Group Standings</h2>
          <div className="space-y-8">
            {eventGroups.map(group => {
              const standings = calculateGroupStandings(group.id);
              return (
                <div key={group.id} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{group.name}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3">Pos</th>
                          <th className="text-left py-2 px-3">Team</th>
                          <th className="text-center py-2 px-3">MP</th>
                          <th className="text-center py-2 px-3">W</th>
                          <th className="text-center py-2 px-3">L</th>
                          <th className="text-center py-2 px-3">Pts</th>
                          <th className="text-center py-2 px-3">Sets</th>
                          <th className="text-center py-2 px-3">Ratio</th>
                          <th className="text-center py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((team, index) => (
                          <tr key={team.id} className={`border-b border-gray-100 ${index < 2 ? 'bg-green-50' : ''}`}>
                            <td className="py-3 px-3 font-semibold">{index + 1}</td>
                            <td className="py-3 px-3">
                              <div>
                                <div className="font-medium">{team.teamName}</div>
                                <div className="text-xs text-gray-600">{team.district}</div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">{team.matchesPlayed}</td>
                            <td className="py-3 px-3 text-center text-green-600 font-medium">{team.wins}</td>
                            <td className="py-3 px-3 text-center text-red-600 font-medium">{team.losses}</td>
                            <td className="py-3 px-3 text-center font-bold">{team.points}</td>
                            <td className="py-3 px-3 text-center">{team.setsWon}-{team.setsLost}</td>
                            <td className="py-3 px-3 text-center">{team.setRatio}</td>
                            <td className="py-3 px-3 text-center">
                              {index < 2 ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                  Qualified
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  Eliminated
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Event Selected */}
      {!selectedEventId && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Select an Event</h3>
          <p className="text-gray-600">Choose an event above to view detailed results and download reports</p>
        </div>
      )}
    </div>
  );
};

export default Results;