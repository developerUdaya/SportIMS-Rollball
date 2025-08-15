import React, { useState } from 'react';
import { User, Plus, Edit, Trash2, Camera, Save, X, Calendar, Hash, UserCheck, Download, FileSpreadsheet } from 'lucide-react';
import { FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PlayerFormData, Team, Player } from '../../types';
import ImageUpload from './ImageUpload';
import DocumentUpload from './DocumentUpload';
import * as XLSX from 'xlsx';
import { exportTeamToPDF } from '../../utils/teamExportUtils';

const PlayerManagement: React.FC = () => {
  const { user } = useAuth();
  const { players, teams, addPlayer, updatePlayer, deletePlayer } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState<PlayerFormData>({
    name: '',
    fatherName: '',
    dob: '',
    role: '',
    jerseyNumber: 1,
    photo: '',
    aadhar: '',
    aadharCertificate: '',
    birthCertificate: '',
    irbfCertificate: '',
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

  const userTeam: Team | undefined = teams.find(team => team.email === user?.email);
  const teamPlayers: Player[] = players.filter(player => player.teamId === userTeam?.id);

  const playerRoles: string[] = [
    'Spiker',
    'Libero',
    'Setter',
    'Middle Blocker',
    'Outside Hitter',
    'Opposite Hitter',
    'Defensive Specialist'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jerseyNumber' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!userTeam) {
        setError('Please register your team first');
        setLoading(false);
        return;
      }

      if (teamPlayers.length >= 12 && !editingPlayer) {
        setError('Maximum 12 players allowed per team');
        setLoading(false);
        return;
      }

      // Check jersey number uniqueness
      const existingJersey: Player | undefined = teamPlayers.find(p => 
        p.jerseyNumber === formData.jerseyNumber && p.id !== editingPlayer?.id
      );
      if (existingJersey) {
        setError('Jersey number already taken');
        setLoading(false);
        return;
      }

      // Add player
      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, formData);
      } else {
        await addPlayer({
          ...formData,
          teamId: userTeam.id
        });
      }

      // Reset form
      setFormData({
        name: '',
        fatherName: '',
        dob: '',
        role: '',
        jerseyNumber: 1,
        photo: '',
        aadhar: '',
        address: '',
        email: '',
        mobile: '',
        irbfNo: '',
        sex: 'male',
        schoolCollege: '',
        district: ''
      });
      setShowForm(false);
      setEditingPlayer(null);
    } catch (err) {
      setError('Failed to save player. Please try again.');
    }
    
    setLoading(false);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      fatherName: player.fatherName,
      dob: player.dob,
      role: player.role,
      jerseyNumber: player.jerseyNumber,
      photo: player.photo || '',
      aadhar: player.aadhar || '',
      aadharCertificate: player.aadharCertificate || '',
      birthCertificate: player.birthCertificate || '',
      irbfCertificate: player.irbfCertificate || '',
      address: player.address,
      email: player.email,
      mobile: player.mobile,
      irbfNo: player.irbfNo,
      sex: player.sex,
      schoolCollege: player.schoolCollege,
      district: player.district
    });
    setShowForm(true);
  };

  const handleDelete = async (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await deletePlayer(playerId);
      } catch (error) {
        console.error('Error deleting player:', error);
        setError('Failed to delete player. Please try again.');
      }
    }
  };
  const handleCancel = () => {
    setShowForm(false);
    setEditingPlayer(null);
    setFormData({
      name: '',
      fatherName: '',
      dob: '',
      role: '',
      jerseyNumber: 1,
      photo: '',
      aadhar: '',
      aadharCertificate: '',
      birthCertificate: '',
      irbfCertificate: '',
      aadharCertificate: '',
      birthCertificate: '',
      irbfCertificate: '',
      address: '',
      email: '',
      mobile: '',
      irbfNo: '',
      sex: 'male',
      schoolCollege: '',
      district: ''
    });
    setError('');
  };

  const exportPlayersToExcel = async () => {
    if (!userTeam) return;

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
    const ws = XLSX.utils.json_to_sheet(playersData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Jersey Number
      { wch: 25 }, // Player Name
      { wch: 15 }, // Date of Birth
      { wch: 8 },  // Age
      { wch: 20 }, // Role
      { wch: 50 }, // Photo URL
      { wch: 20 }  // Aadhar Number
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Players');
    XLSX.writeFile(wb, `${userTeam.teamName}_Players.xlsx`);
  };

    const exportTeamToPDFHandler = async () => {
    if (!userTeam) return;
    await exportTeamToPDF(userTeam, teamPlayers);
  };
  if (!userTeam) {


    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Registration Required</h2>
          <p className="text-gray-600 mb-6">
            You need to register your team before managing players.
          </p>
          <a
            href="/team-registration"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Team
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Player Management</h1>
            <p className="text-gray-600">Manage your team players ({teamPlayers.length}/12)</p>
          </div>
          <div className="flex space-x-3">
            {teamPlayers.length > 0 && (
              <>
                <button
                  onClick={exportTeamToPDFHandler}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Export Team PDF
                </button>
              <button
                onClick={exportPlayersToExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Export Players
              </button>
              </>
            )}
            <button
              onClick={() => setShowForm(true)}
              disabled={teamPlayers.length >= 12}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Player
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Player Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {editingPlayer ? 'Edit Player' : 'Add New Player'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                  Name (in Block Letters) *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    style={{ textTransform: 'uppercase' }}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter player name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father's Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="fatherName"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter father's name"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="dob"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sex *
                </label>
                <select
                  name="sex"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.sex}
                  onChange={handleInputChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Role *
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="role"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">Select role</option>
                    {playerRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jersey Number *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="jerseyNumber"
                    required
                    min="1"
                    max="99"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jersey number"
                    value={formData.jerseyNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Id *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  pattern="[0-9]{10}"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IRBF 10No. *
                </label>
                <input
                  type="text"
                  name="irbfNo"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter IRBF registration number"
                  value={formData.irbfNo}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of the School/College *
                </label>
                <input
                  type="text"
                  name="schoolCollege"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school/college name"
                  value={formData.schoolCollege}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of the District *
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter district name"
                  value={formData.district}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Photo (Optional)
                </label>
                <ImageUpload
                  onImageUpload={(imageUrl) => setFormData(prev => ({ ...prev, photo: imageUrl }))}
                  currentImage={formData.photo}
                  playerId={editingPlayer?.id}
                />
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
                  value={formData.aadhar}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DocumentUpload
                    onDocumentUpload={(url) => setFormData(prev => ({ ...prev, aadharCertificate: url }))}
                    currentDocument={formData.aadharCertificate}
                    playerId={editingPlayer?.id}
                    documentType="aadhar"
                    label="Aadhar Certificate"
                  />
                  
                  <DocumentUpload
                    onDocumentUpload={(url) => setFormData(prev => ({ ...prev, birthCertificate: url }))}
                    currentDocument={formData.birthCertificate}
                    playerId={editingPlayer?.id}
                    documentType="birth"
                    label="Birth Certificate"
                  />
                  
                  <DocumentUpload
                    onDocumentUpload={(url) => setFormData(prev => ({ ...prev, irbfCertificate: url }))}
                    currentDocument={formData.irbfCertificate}
                    playerId={editingPlayer?.id}
                    documentType="irbf"
                    label="IRBF Certificate"
                  />
                </div>
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
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? 'Saving...' : editingPlayer ? 'Update Player' : 'Add Player'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Players List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Team Players</h2>
        
        {teamPlayers.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No players added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add First Player
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamPlayers.map((player) => (
              <div key={player.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {player.photo ? (
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">{player.name}</h3>
                      <p className="text-sm text-gray-600">#{player.jerseyNumber}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(player)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit Player"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Player"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium">{player.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">DOB:</span>
                    <span className="font-medium">{new Date(player.dob).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Father:</span>
                    <span className="font-medium">{player.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile:</span>
                    <span className="font-medium">{player.mobile}</span>
                  </div>
                  {player.aadhar && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aadhar:</span>
                      <span className="font-medium">****{player.aadhar.slice(-4)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;