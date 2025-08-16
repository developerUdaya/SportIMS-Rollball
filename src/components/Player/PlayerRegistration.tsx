import React, { useState } from 'react';
import { User, Calendar, Hash, UserCheck, Save, AlertCircle, Users, Phone, Mail, MapPin, School, CreditCard } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PlayerFormData } from '../../types';
import ImageUpload from './ImageUpload';
import DocumentUpload from './DocumentUpload';

const PlayerRegistration: React.FC = () => {
  const { teams, addPlayer } = useData();
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
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const playerRoles: string[] = [
    'Spiker',
    'Libero',
    'Setter',
    'Middle Blocker',
    'Outside Hitter',
    'Opposite Hitter',
    'Defensive Specialist'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      if (!selectedTeamId) {
        setError('Please select a team');
        setLoading(false);
        return;
      }

      if (formData.mobile.length !== 10) {
        setError('Mobile number must be 10 digits');
        setLoading(false);
        return;
      }

      // Check jersey number uniqueness within the team
      const teamPlayers = await getTeamPlayers(selectedTeamId);
      const existingJersey = teamPlayers.find(p => p.jerseyNumber === formData.jerseyNumber);
      if (existingJersey) {
        setError('Jersey number already taken in this team');
        setLoading(false);
        return;
      }

      if (teamPlayers.length >= 12) {
        setError('Maximum 12 players allowed per team');
        setLoading(false);
        return;
      }

      // Add player
      await addPlayer({
        ...formData,
        teamId: selectedTeamId
      });

      // Reset form
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
        address: '',
        email: '',
        mobile: '',
        irbfNo: '',
        sex: 'male',
        schoolCollege: '',
        district: ''
      });
      setSelectedTeamId('');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to register player. Please try again.');
    }
    
    setLoading(false);
  };

  const getTeamPlayers = async (teamId: string) => {
    // This would typically be fetched from the database
    // For now, we'll use the players from context filtered by team
    const { players } = useData();
    return players.filter(player => player.teamId === teamId);
  };

  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="text-center">
          <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <UserCheck className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Player Registration</h1>
          <p className="text-gray-600">Register a new player for a Rollball team</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-1 rounded-full mr-3">
              <Save className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-green-800 font-medium">Player registered successfully!</p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Team *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.teamName} - {team.district} (Coach: {team.coachName})
                  </option>
                ))}
              </select>
            </div>
            {selectedTeam && (
              <div className="mt-3 text-sm text-blue-700">
                <p><strong>Team:</strong> {selectedTeam.teamName}</p>
                <p><strong>Coach:</strong> {selectedTeam.coachName}</p>
                <p><strong>District:</strong> {selectedTeam.district}</p>
              </div>
            )}
          </div>

          {/* Player Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Id *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  required
                  pattern="[0-9]{10}"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IRBF 10No. *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="irbfNo"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter IRBF registration number"
                  value={formData.irbfNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name of the School/College *
              </label>
              <div className="relative">
                <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="schoolCollege"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school/college name"
                  value={formData.schoolCollege}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name of the District *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="district"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter district name"
                  value={formData.district}
                  onChange={handleInputChange}
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
                value={formData.aadhar}
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
              />
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DocumentUpload
                  onDocumentUpload={(url) => setFormData(prev => ({ ...prev, aadharCertificate: url }))}
                  currentDocument={formData.aadharCertificate}
                  documentType="aadhar"
                  label="Aadhar Certificate"
                />
                
                <DocumentUpload
                  onDocumentUpload={(url) => setFormData(prev => ({ ...prev, birthCertificate: url }))}
                  currentDocument={formData.birthCertificate}
                  documentType="birth"
                  label="Birth Certificate"
                />
                
                <DocumentUpload
                  onDocumentUpload={(url) => setFormData(prev => ({ ...prev, irbfCertificate: url }))}
                  currentDocument={formData.irbfCertificate}
                  documentType="irbf"
                  label="IRBF Certificate"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
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
                  address: '',
                  email: '',
                  mobile: '',
                  irbfNo: '',
                  sex: 'male',
                  schoolCollege: '',
                  district: ''
                });
                setSelectedTeamId('');
                setError('');
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTeamId}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Registering...' : 'Register Player'}
            </button>
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Registration Instructions:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• All fields marked with (*) are mandatory</li>
          <li>• Player name should be in BLOCK LETTERS</li>
          <li>• Mobile number must be exactly 10 digits</li>
          <li>• Jersey number must be unique within the selected team</li>
          <li>• Maximum 12 players allowed per team</li>
          <li>• Upload clear photos and documents for verification</li>
        </ul>
      </div>
    </div>
  );
};

export default PlayerRegistration;