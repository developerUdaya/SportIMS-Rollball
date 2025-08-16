import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TeamFormData, Team } from '../../types';

const TeamRegistration: React.FC = () => {
  const { user } = useAuth();
  const { teams, addTeam } = useData();
  const [formData, setFormData] = useState<TeamFormData>({
    teamName: '',
    coachName: '',
    district: '',
    mobile: '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if user already has a team registered
  const existingTeam: Team | undefined = teams.find(team => team.email === user?.email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (formData.mobile.length !== 10) {
        setError('Mobile number must be 10 digits');
        setLoading(false);
        return;
      }

      // Add team
      const teamData: Omit<Team, 'id' | 'createdAt'> = {
        ...formData,
        password: '' // Password not needed for Supabase
      };
      await addTeam(teamData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        teamName: '',
        coachName: '',
        district: '',
        mobile: '',
        email: user?.email || ''
      });
    } catch (err) {
      setError('Failed to register team. Please try again.');
    }
    
    setLoading(false);
  };

  if (existingTeam) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">District Profile</h2>
            {/* <p className="text-gray-600">Your team information is already in the system.</p> */}
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
              <p className="text-gray-900 font-semibold">{existingTeam.teamName}</p>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
              <p className="text-gray-900">{existingTeam.coachName}</p>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <p className="text-gray-900">{existingTeam.district}</p>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <p className="text-gray-900">{existingTeam.mobile}</p>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{existingTeam.email}</p>
              </div>
              <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
              <p className="text-gray-900">{existingTeam.createdAt ? new Date(existingTeam.createdAt).toLocaleString() : '-'}</p>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team ID</label>
              <p className="text-gray-900">{existingTeam.id || '-'}</p> */}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need to make changes? Contact the tournament administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Team Registration</h2>
          <p className="text-gray-600">Register your Rollball team for tournaments</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-1 rounded-full mr-3">
                <Save className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-green-800 font-medium">Team registered successfully!</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                Team Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter team name"
                  value={formData.teamName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="coachName" className="block text-sm font-medium text-gray-700 mb-2">
                Coach Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="coachName"
                  name="coachName"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter coach name"
                  value={formData.coachName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="district"
                  name="district"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  pattern="[0-9]{10}"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  value={formData.email}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email is automatically filled from your account</p>
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Registering...' : 'Register Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamRegistration;