import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Users, Trophy, Save, X, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EventFormData, Event } from '../../types';

const EventManagement: React.FC = () => {
  const { events, teams, addEvent, updateEvent } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    category: '',
    gender: 'male',
    startDate: '',
    endDate: '',
    maxTeams: 16,
    minDob: '',
    maxDob: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories: string[] = [
    'UNDER 9',
    'UNDER 11',
    'UNDER 14',
    'UNDER 17',
    'ABOVE 17'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxTeams' ? parseInt(value) || 16 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        setError('End date must be after start date');
        setLoading(false);
        return;
      }

      if (formData.maxTeams < 4 || formData.maxTeams > 64) {
        setError('Maximum teams must be between 4 and 64');
        setLoading(false);
        return;
      }

      if (formData.minDob && formData.maxDob && new Date(formData.minDob) >= new Date(formData.maxDob)) {
        setError('Minimum date of birth must be before maximum date of birth');
        setLoading(false);
        return;
      }

      if (editingEvent) {
        // Update existing event
        await updateEvent(editingEvent.id, formData);
      } else {
        // Add new event
        await addEvent(formData);
      }

      // Reset form
      setFormData({
        name: '',
        category: '',
        gender: 'male',
        startDate: '',
        endDate: '',
        maxTeams: 16,
        minDob: '',
        maxDob: ''
      });
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      setError('Failed to save event. Please try again.');
    }
    
    setLoading(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      category: event.category,
      gender: event.gender,
      startDate: event.startDate,
      endDate: event.endDate,
      maxTeams: event.maxTeams,
      minDob: event.minDob || '',
      maxDob: event.maxDob || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      category: '',
      gender: 'male',
      startDate: '',
      endDate: '',
      maxTeams: 16,
      minDob: '',
      maxDob: ''
    });
    setError('');
  };

  const getRegisteredTeamsCount = (eventId: string): number => {
    return teams.filter(team => team.eventId === eventId).length;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Management</h1>
            <p className="text-gray-600">Create and manage Rollball tournaments</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Add/Edit Event Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  {/* <option value="mixed">Mixed</option> */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Date of Birth (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="minDob"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.minDob}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Oldest allowed birth date for participants</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Date of Birth (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="maxDob"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.maxDob}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Youngest allowed birth date for participants</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Teams *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="maxTeams"
                    required
                    min="4"
                    max="64"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Maximum teams"
                    value={formData.maxTeams}
                    onChange={handleInputChange}
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
                {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">All Events</h2>
        
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No events created yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const registeredCount = getRegisteredTeamsCount(event.id);
              const isEventFull = registeredCount >= event.maxTeams;
              
              return (
                <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Trophy className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{event.name}</h3>
                        <p className="text-sm text-gray-600">{event.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">{event.gender}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Teams:</span>
                      <span className={`font-medium ${isEventFull ? 'text-red-600' : 'text-green-600'}`}>
                        {registeredCount}/{event.maxTeams}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isEventFull ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${(registeredCount / event.maxTeams) * 100}%` }}
                      ></div>
                    </div>
                    
                    {isEventFull && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                        <p className="text-xs text-red-600 text-center">Event Full</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;