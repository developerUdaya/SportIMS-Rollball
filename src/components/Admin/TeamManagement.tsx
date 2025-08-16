import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Eye, UserPlus, Download, FileText, FileSpreadsheet, Search, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Team, Player, PlayerFormData } from '../../types';
import { exportTeamToPDF } from '../../utils/teamExportUtils';
import * as XLSX from 'xlsx';
import ImageUpload from '../Player/ImageUpload';
import DocumentUpload from '../Player/DocumentUpload';

const TeamManagement: React.FC = () => {
  const { teams, players, addPlayer } = useData();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [playerFormData, setPlayerFormData] = useState<PlayerFormData>({
    name: '',
    dob: '',
    role: '',
    jerseyNumber: 1,
    photo: '',
    aadhar: '',
    aadharCertificate: '',
    birthCertificate: '',
    irbfCertificate: '',
    fatherName: '',
    address: '',
    email: '',
    mobile: '',
    irbfNo: '',
    sex: 'male',
    schoolCollege: '',
    district: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const playerRoles = [
    'Spiker', 'Libero', 'Setter', 'Middle Blocker', 'Outside Hitter', 'Opposite Hitter', 'Defensive Specialist'
  ];

  const districts = [...new Set(teams.map(team => team.district))].sort();
  
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.coachName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !filterDistrict || team.district === filterDistrict;
    return matchesSearch && matchesDistrict;
  });

  const getTeamPlayers = (teamId: string) => {
    return players.filter(player => player.teamId === teamId);
  };

  const handlePlayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlayerFormData(prev => ({
      ...prev,
      [name]: name === 'jerseyNumber' ? parseInt(value) || 1 : value
    }));
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    setError('');
    setLoading(true);

    try {
      const teamPlayers = getTeamPlayers(selectedTeam.id);
      
      if (teamPlayers.length >= 12) {
        setError('Maximum 12 players allowed per team');
        setLoading(false);
        return;
      }

      const existingJersey = teamPlayers.find(p => p.jerseyNumber === playerFormData.jerseyNumber);
      if (existingJersey) {
        setError('Jersey number already taken');
        setLoading(false);
        return;
      }

      await addPlayer({
        ...playerFormData,
        teamId: selectedTeam.id
      });

      setPlayerFormData({
              name: '',
              dob: '',
              role: '',
              jerseyNumber: 1,
              photo: '',
              aadhar: '',
              aadharCertificate: '',
              birthCertificate: '',
              irbfCertificate: '',
              fatherName: '',
              address: '',
              email: '',
              mobile: '',
              irbfNo: '',
              sex: 'male',
              schoolCollege: '',
              district: ''
            });
      setShowPlayerForm(false);
    } catch (err) {
      setError('Failed to add player. Please try again.');
    }
    
    setLoading(false);
  };

  const exportTeamToPDFHandler = async (team: Team) => {
    const teamPlayers = getTeamPlayers(team.id);
    await exportTeamToPDF(team, teamPlayers);
  };

  const exportTeamToExcel = (team: Team) => {
    const teamPlayers = getTeamPlayers(team.id);
    
    const playersData = teamPlayers.map(player => ({
      'Jersey Number': player.jerseyNumber,
      'Player Name': player.name,
      'Date of Birth': player.dob,
      'Age': new Date().getFullYear() - new Date(player.dob).getFullYear(),
      'Role': player.role,
      'Photo URL': player.photo || 'No photo',
      'Aadhar Number': player.aadhar || 'Not provided'
    }));

    const wb = XLSX.utils.book_new();
    
    // Team summary
    const teamSummary = [{
      'Team Name': team.teamName,
      'Coach': team.coachName,
      'District': team.district,
      'Mobile': team.mobile,
      'Email': team.email,
      'Total Players': teamPlayers.length,
      'Registration Date': new Date(team.createdAt).toLocaleDateString()
    }];
    
    const summaryWS = XLSX.utils.json_to_sheet(teamSummary);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Team Summary');
    
    const playersWS = XLSX.utils.json_to_sheet(playersData);
    XLSX.utils.book_append_sheet(wb, playersWS, 'Players');
    
    XLSX.writeFile(wb, `${team.teamName}_Complete_Details.xlsx`);
  };

  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);

  // Player Details Modal
  type PlayerDetailsModalProps = {
    player: Player | null;
    onClose: () => void;
  };
  
  const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ player, onClose }) => {
    if (!player) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Player Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-16 h-16 rounded-full object-cover border border-blue-200" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{player.name}</h3>
                <p className="text-sm text-gray-600">#{player.jerseyNumber} &bull; {player.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">DOB:</span>
                <span className="font-medium ml-2">{new Date(player.dob).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Age:</span>
                <span className="font-medium ml-2">{new Date().getFullYear() - new Date(player.dob).getFullYear()}</span>
              </div>
              <div>
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium ml-2">{player.sex}</span>
              </div>
              <div>
                <span className="text-gray-600">School/College:</span>
                <span className="font-medium ml-2">{player.schoolCollege}</span>
              </div>
              <div>
                <span className="text-gray-600">District:</span>
                <span className="font-medium ml-2">{player.district}</span>
              </div>
              <div>
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium ml-2">{player.mobile}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="font-medium ml-2">{player.email}</span>
              </div>
              <div>
                <span className="text-gray-600">IRBF No:</span>
                <span className="font-medium ml-2">{player.irbfNo}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium ml-2">{player.address}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-600">Aadhar Number:</span>
                <span className="font-medium ml-2">{player.aadhar}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {player.aadharCertificate && (
                <button
                  type="button"
                  title="View Aadhar Certificate"
                  onClick={() => window.open(player.aadharCertificate, '_blank')}
                  className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                >
                  <FileText className="h-4 w-4 mr-1 text-gray-600" />
                  Aadhar
                </button>
              )}
              {player.birthCertificate && (
                <button
                  type="button"
                  title="View Birth Certificate"
                  onClick={() => window.open(player.birthCertificate, '_blank')}
                  className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                >
                  <FileText className="h-4 w-4 mr-1 text-gray-600" />
                  Birth
                </button>
              )}
              {player.irbfCertificate && (
                <button
                  type="button"
                  title="View IRBF Certificate"
                  onClick={() => window.open(player.irbfCertificate, '_blank')}
                  className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                >
                  <FileText className="h-4 w-4 mr-1 text-gray-600" />
                  IRBF
                </button>
              )}
              {player.photo && (
                <button
                  type="button"
                  title="View Photo"
                  onClick={() => window.open(player.photo, '_blank')}
                  className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                >
                  <Eye className="h-4 w-4 mr-1 text-gray-600" />
                  Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Team Management</h1>
            <p className="text-gray-600">Manage all registered teams and their players</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{teams.length}</p>
            <p className="text-sm text-gray-600">Total Teams</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Teams</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team name or coach..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by District</label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <p>Showing {filteredTeams.length} of {teams.length} teams</p>
              <p>Total Players: {players.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map((team) => {
          const teamPlayers = getTeamPlayers(team.id);
          return (
            <div key={team.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{team.teamName}</h3>
                  <p className="text-gray-600">Coach: {team.coachName}</p>
                  <p className="text-sm text-gray-500">{team.district}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{teamPlayers.length}</p>
                  <p className="text-xs text-gray-500">Players</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{team.mobile}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{team.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Registered:</span>
                  <span className="font-medium">{new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Players Preview */}
              {teamPlayers.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Players:</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {teamPlayers.slice(0, 6).map((player) => (
                      <div key={player.id} className="flex items-center space-x-2 text-xs">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                        <span className="truncate">#{player.jerseyNumber} {player.name}</span>
                      </div>
                    ))}
                    {teamPlayers.length > 6 && (
                      <div className="text-xs text-gray-500">
                        +{teamPlayers.length - 6} more players
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTeam(team)}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </button>
                
                {/* <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowPlayerForm(true);
                  }}
                  disabled={teamPlayers.length >= 12}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Add Player
                </button> */}
                
                <button
                  onClick={() => exportTeamToPDFHandler(team)}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </button>
                
                <button
                  onClick={() => exportTeamToExcel(team)}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  Excel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && !showPlayerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedTeam.teamName}</h2>
                  <p className="text-gray-600">Complete Team Details</p>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Team Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Team Name</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedTeam.teamName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Coach Name</label>
                    <p className="text-gray-900">{selectedTeam.coachName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <p className="text-gray-900">{selectedTeam.district}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <p className="text-gray-900">{selectedTeam.mobile}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedTeam.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                    <p className="text-gray-900">{new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Players List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Players ({getTeamPlayers(selectedTeam.id).length}/12)
                  </h3>
                  <button
                    onClick={() => setShowPlayerForm(true)}
                    disabled={getTeamPlayers(selectedTeam.id).length >= 12}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Player
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTeamPlayers(selectedTeam.id).map((player) => (
                    <div key={player.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {player.photo ? (
                          <button
                            type="button"
                            title="View Photo"
                            onClick={() => window.open(player.photo, '_blank')}
                            className="focus:outline-none"
                          >
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="w-12 h-12 rounded-full object-cover border border-blue-200"
                            />
                          </button>
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800">{player.name}</h4>
                          <p className="text-sm text-gray-600">#{player.jerseyNumber}</p>
                        </div>
                        <button
                          type="button"
                          title="View All Details"
                          onClick={() => setModalPlayer(player)}
                          className="ml-auto p-2 rounded hover:bg-gray-100"
                        >
                          <Eye className="h-5 w-5 text-blue-600" />
                        </button>
                      </div>
                      <div className="space-y-1 text-sm">
                        {/* <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <span className="font-medium">{player.role}</span>
                        </div> */}
                        <div className="flex justify-between">
                          <span className="text-gray-600">DOB:</span>
                          <span className="font-medium">{new Date(player.dob).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium">
                            {new Date().getFullYear() - new Date(player.dob).getFullYear()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium">{player.sex}</span>
                        </div>
                        {/* <div className="flex justify-between">
                          <span className="text-gray-600">School/College:</span>
                          <span className="font-medium">{player.schoolCollege}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">District:</span>
                          <span className="font-medium">{player.district}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mobile:</span>
                          <span className="font-medium">{player.mobile}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{player.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IRBF No:</span>
                          <span className="font-medium">{player.irbfNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium">{player.address}</span>
                        </div> */}
                      </div>
                      <div className="flex gap-2 mt-3">
                        {player.aadharCertificate && (
                          <button
                            type="button"
                            title="View Aadhar Certificate"
                            onClick={() => window.open(player.aadharCertificate, '_blank')}
                            className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                          >
                            <FileText className="h-4 w-4 mr-1 text-gray-600" />
                            Aadhar
                          </button>
                        )}
                        {player.birthCertificate && (
                          <button
                            type="button"
                            title="View Birth Certificate"
                            onClick={() => window.open(player.birthCertificate, '_blank')}
                            className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                          >
                            <FileText className="h-4 w-4 mr-1 text-gray-600" />
                            Birth
                          </button>
                        )}
                        {player.irbfCertificate && (
                          <button
                            type="button"
                            title="View IRBF Certificate"
                            onClick={() => window.open(player.irbfCertificate, '_blank')}
                            className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                          >
                            <FileText className="h-4 w-4 mr-1 text-gray-600" />
                            IRBF
                          </button>
                        )}
                        {player.photo && (
                          <button
                            type="button"
                            title="View Photo"
                            onClick={() => window.open(player.photo, '_blank')}
                            className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-xs"
                          >
                            <Eye className="h-4 w-4 mr-1 text-gray-600" />
                            Photo
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <PlayerDetailsModal player={modalPlayer} onClose={() => setModalPlayer(null)} />

                {getTeamPlayers(selectedTeam.id).length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No players added yet</p>
                    <button
                      onClick={() => setShowPlayerForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Player
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {showPlayerForm && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Add Player</h2>
                  <p className="text-gray-600">Add new player to {selectedTeam.teamName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowPlayerForm(false);
                    setPlayerFormData({
                      name: '',
                      dob: '',
                      role: '',
                      jerseyNumber: 1,
                      photo: '',
                      aadhar: '',
                      aadharCertificate: '',
                      birthCertificate: '',
                      irbfCertificate: '',
                      fatherName: '',
                      address: '',
                      email: '',
                      mobile: '',
                      irbfNo: '',
                      sex: 'male',
                      schoolCollege: '',
                      district: ''
                    });
                    setError('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddPlayer} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Player Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter player name"
                    value={playerFormData.name}
                    onChange={handlePlayerInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={playerFormData.dob}
                    onChange={handlePlayerInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Player Role *
                  </label>
                  <select
                    name="role"
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={playerFormData.role}
                    onChange={handlePlayerInputChange}
                  >
                    <option value="">Select role</option>
                    {playerRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jersey Number *
                  </label>
                  <input
                    type="number"
                    name="jerseyNumber"
                    required
                    min="1"
                    max="99"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jersey number"
                    value={playerFormData.jerseyNumber}
                    onChange={handlePlayerInputChange}
                  />
                </div>

                <div>
                  <ImageUpload
                    onImageUpload={(imageUrl) => setPlayerFormData(prev => ({ ...prev, photo: imageUrl }))}
                    currentImage={playerFormData.photo}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DocumentUpload
                      onDocumentUpload={(url) => setPlayerFormData(prev => ({ ...prev, aadharCertificate: url }))}
                      currentDocument={playerFormData.aadharCertificate}
                      documentType="aadhar"
                      label="Aadhar Certificate"
                    />
                    
                    <DocumentUpload
                      onDocumentUpload={(url) => setPlayerFormData(prev => ({ ...prev, birthCertificate: url }))}
                      currentDocument={playerFormData.birthCertificate}
                      documentType="birth"
                      label="Birth Certificate"
                    />
                    
                    <DocumentUpload
                      onDocumentUpload={(url) => setPlayerFormData(prev => ({ ...prev, irbfCertificate: url }))}
                      currentDocument={playerFormData.irbfCertificate}
                      documentType="irbf"
                      label="IRBF Certificate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="aadhar"
                    pattern="[0-9]{12}"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12-digit Aadhar number"
                    value={playerFormData.aadhar}
                    onChange={handlePlayerInputChange}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPlayerForm(false);
                    setPlayerFormData({
                      name: '',
                      dob: '',
                      role: '',
                      jerseyNumber: 1,
                      photo: '',
                      aadhar: '',
                      aadharCertificate: '',
                      birthCertificate: '',
                      irbfCertificate: ''
                    });
                    setError('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {loading ? 'Adding...' : 'Add Player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* No Teams */}
      {filteredTeams.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchTerm || filterDistrict ? 'No teams found' : 'No teams registered yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterDistrict 
              ? 'Try adjusting your search or filter criteria'
              : 'Teams will appear here once they register for tournaments'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;