import React, { useState, useEffect } from 'react';
import { Trophy, Users, Crown, Medal, Target } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface KnockoutMatch {
  id: string;
  team1Id?: string;
  team2Id?: string;
  winnerId?: string;
  stage: 'quarterfinal' | 'semifinal' | 'final';
  position: number;
}

const KnockoutStage: React.FC = () => {
  const { events, teams, groups, matches, addMatch, updateMatch } = useData();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([]);
  const [qualifiedTeams, setQualifiedTeams] = useState<any[]>([]);

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const eventGroups = groups.filter(group => group.eventId === selectedEventId);
  const eventMatches = matches.filter(match => match.eventId === selectedEventId);

  useEffect(() => {
    if (selectedEventId) {
      calculateQualifiedTeams();
    }
  }, [selectedEventId, matches]);

  const calculateQualifiedTeams = () => {
    const qualified: any[] = [];
    
    eventGroups.forEach(group => {
      const groupTeams = teams.filter(team => group.teams.includes(team.id));
      const groupMatches = eventMatches.filter(match => match.groupId === group.id && match.result);
      
      // Calculate points for each team
      const teamStats = groupTeams.map(team => {
        let wins = 0;
        let losses = 0;
        let setsWon = 0;
        let setsLost = 0;
        
        groupMatches.forEach(match => {
          if (match.team1Id === team.id || match.team2Id === team.id) {
            if (match.result?.winnerId === team.id) {
              wins++;
              if (match.team1Id === team.id) {
                setsWon += match.result.team1Sets;
                setsLost += match.result.team2Sets;
              } else {
                setsWon += match.result.team2Sets;
                setsLost += match.result.team1Sets;
              }
            } else {
              losses++;
              if (match.team1Id === team.id) {
                setsWon += match.result?.team1Sets || 0;
                setsLost += match.result?.team2Sets || 0;
              } else {
                setsWon += match.result?.team2Sets || 0;
                setsLost += match.result?.team1Sets || 0;
              }
            }
          }
        });
        
        return {
          ...team,
          wins,
          losses,
          points: wins * 2,
          setsWon,
          setsLost,
          setRatio: setsLost > 0 ? setsWon / setsLost : setsWon,
          groupName: group.name
        };
      });
      
      // Sort by points, then by set ratio
      teamStats.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.setRatio - a.setRatio;
      });
      
      // Take top 2 teams from each group
      qualified.push(...teamStats.slice(0, 2));
    });
    
    setQualifiedTeams(qualified);
  };

  const generateKnockoutBracket = () => {
    if (qualifiedTeams.length < 4) {
      alert('Need at least 4 qualified teams to generate knockout bracket');
      return;
    }

    const bracket: KnockoutMatch[] = [];
    const numTeams = qualifiedTeams.length;
    
    // Generate quarterfinals (if needed)
    if (numTeams > 4) {
      const numQuarterfinals = numTeams / 2;
      for (let i = 0; i < numQuarterfinals; i++) {
        bracket.push({
          id: `qf-${i}`,
          team1Id: qualifiedTeams[i * 2]?.id,
          team2Id: qualifiedTeams[i * 2 + 1]?.id,
          stage: 'quarterfinal',
          position: i
        });
      }
    }
    
    // Generate semifinals
    const numSemifinals = Math.min(4, numTeams) / 2;
    for (let i = 0; i < numSemifinals; i++) {
      if (numTeams <= 4) {
        // Direct to semifinals
        bracket.push({
          id: `sf-${i}`,
          team1Id: qualifiedTeams[i * 2]?.id,
          team2Id: qualifiedTeams[i * 2 + 1]?.id,
          stage: 'semifinal',
          position: i
        });
      } else {
        // From quarterfinals
        bracket.push({
          id: `sf-${i}`,
          stage: 'semifinal',
          position: i
        });
      }
    }
    
    // Generate final
    bracket.push({
      id: 'final',
      stage: 'final',
      position: 0
    });
    
    setKnockoutMatches(bracket);
  };

  const updateKnockoutResult = (matchId: string, winnerId: string) => {
    const updatedMatches = knockoutMatches.map(match => {
      if (match.id === matchId) {
        return { ...match, winnerId };
      }
      return match;
    });
    
    setKnockoutMatches(updatedMatches);
    
    // Update next round
    const match = updatedMatches.find(m => m.id === matchId);
    if (match) {
      if (match.stage === 'quarterfinal') {
        // Update semifinal
        const sfPosition = Math.floor(match.position / 2);
        const sfMatch = updatedMatches.find(m => m.stage === 'semifinal' && m.position === sfPosition);
        if (sfMatch) {
          if (match.position % 2 === 0) {
            sfMatch.team1Id = winnerId;
          } else {
            sfMatch.team2Id = winnerId;
          }
        }
      } else if (match.stage === 'semifinal') {
        // Update final
        const finalMatch = updatedMatches.find(m => m.stage === 'final');
        if (finalMatch) {
          if (match.position === 0) {
            finalMatch.team1Id = winnerId;
          } else {
            finalMatch.team2Id = winnerId;
          }
        }
      }
    }
    
    setKnockoutMatches([...updatedMatches]);
  };

  const getTeamName = (teamId?: string) => {
    if (!teamId) return 'TBD';
    const team = teams.find(t => t.id === teamId);
    return team?.teamName || 'Unknown';
  };

  const champion = knockoutMatches.find(m => m.stage === 'final')?.winnerId;
  const championTeam = champion ? teams.find(t => t.id === champion) : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Knockout Stage</h1>
            <p className="text-gray-600">Manage elimination rounds and crown the champion</p>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <Crown className="h-8 w-8 text-purple-500" />
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qualified Teams */}
      {selectedEventId && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Qualified Teams</h2>
            <button
              onClick={generateKnockoutBracket}
              disabled={qualifiedTeams.length < 4}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Target className="h-5 w-5 mr-2" />
              Generate Bracket
            </button>
          </div>

          {qualifiedTeams.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Complete group stage matches to see qualified teams</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {qualifiedTeams.map((team, index) => (
                <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index < 2 ? 'bg-yellow-500' : index < 4 ? 'bg-gray-400' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{team.teamName}</h3>
                      <p className="text-xs text-gray-600">{team.groupName}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Points:</span>
                      <span className="font-medium">{team.points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>W-L:</span>
                      <span className="font-medium">{team.wins}-{team.losses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sets:</span>
                      <span className="font-medium">{team.setsWon}-{team.setsLost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Knockout Bracket */}
      {knockoutMatches.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Tournament Bracket</h2>
          
          <div className="space-y-8">
            {/* Quarterfinals */}
            {knockoutMatches.some(m => m.stage === 'quarterfinal') && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quarterfinals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {knockoutMatches.filter(m => m.stage === 'quarterfinal').map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{getTeamName(match.team1Id)}</span>
                          <input
                            type="radio"
                            name={match.id}
                            checked={match.winnerId === match.team1Id}
                            onChange={() => match.team1Id && updateKnockoutResult(match.id, match.team1Id)}
                            className="text-blue-600"
                          />
                        </div>
                        <div className="text-center text-gray-400 font-bold">VS</div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{getTeamName(match.team2Id)}</span>
                          <input
                            type="radio"
                            name={match.id}
                            checked={match.winnerId === match.team2Id}
                            onChange={() => match.team2Id && updateKnockoutResult(match.id, match.team2Id)}
                            className="text-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Semifinals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Semifinals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {knockoutMatches.filter(m => m.stage === 'semifinal').map((match) => (
                  <div key={match.id} className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{getTeamName(match.team1Id)}</span>
                        <input
                          type="radio"
                          name={match.id}
                          checked={match.winnerId === match.team1Id}
                          onChange={() => match.team1Id && updateKnockoutResult(match.id, match.team1Id)}
                          className="text-blue-600 w-5 h-5"
                        />
                      </div>
                      <div className="text-center text-gray-500 font-bold text-xl">VS</div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{getTeamName(match.team2Id)}</span>
                        <input
                          type="radio"
                          name={match.id}
                          checked={match.winnerId === match.team2Id}
                          onChange={() => match.team2Id && updateKnockoutResult(match.id, match.team2Id)}
                          className="text-blue-600 w-5 h-5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Final</h3>
              {knockoutMatches.filter(m => m.stage === 'final').map((match) => (
                <div key={match.id} className="border-4 border-yellow-300 rounded-lg p-8 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="text-center">
                      <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                      <h4 className="text-2xl font-bold text-gray-800">Championship Final</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <span className="font-bold text-xl">{getTeamName(match.team1Id)}</span>
                        <input
                          type="radio"
                          name={match.id}
                          checked={match.winnerId === match.team1Id}
                          onChange={() => match.team1Id && updateKnockoutResult(match.id, match.team1Id)}
                          className="text-yellow-600 w-6 h-6"
                        />
                      </div>
                      <div className="text-center text-gray-600 font-bold text-2xl">VS</div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <span className="font-bold text-xl">{getTeamName(match.team2Id)}</span>
                        <input
                          type="radio"
                          name={match.id}
                          checked={match.winnerId === match.team2Id}
                          onChange={() => match.team2Id && updateKnockoutResult(match.id, match.team2Id)}
                          className="text-yellow-600 w-6 h-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Champion */}
      {championTeam && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-8 text-white">
          <div className="text-center">
            <Crown className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">🏆 CHAMPION 🏆</h2>
            <h3 className="text-4xl font-bold mb-2">{championTeam.teamName}</h3>
            <p className="text-xl opacity-90">Coach: {championTeam.coachName}</p>
            <p className="text-lg opacity-80">{championTeam.district}</p>
            <div className="mt-6">
              <Medal className="h-12 w-12 mx-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnockoutStage;