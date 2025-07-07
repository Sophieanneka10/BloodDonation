import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationDriveAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CreateDonationDrive() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    capacity: 20,
    bloodTypes: [],
    organizer: currentUser?.firstName + ' ' + currentUser?.lastName,
    organizerPhone: currentUser?.phone || currentUser?.phoneNumber || '',
    organizerEmail: currentUser?.email || ''
  });

  // Available blood types for selection
  const availableBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) : value
    }));
  };

  // Handle blood type selection
  const handleBloodTypeChange = (bloodType) => {
    setFormData(prev => {
      const currentBloodTypes = [...prev.bloodTypes];
      
      if (currentBloodTypes.includes(bloodType)) {
        // Remove blood type if already selected
        return {
          ...prev,
          bloodTypes: currentBloodTypes.filter(type => type !== bloodType)
        };
      } else {
        // Add blood type if not selected
        return {
          ...prev,
          bloodTypes: [...currentBloodTypes, bloodType]
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
        throw new Error('Please fill in all required fields');
      }

      // Format date and times if needed
      const driveData = {
        ...formData,
        // Convert to server expected format if necessary
      };

      // Submit to API
      await donationDriveAPI.createDrive(driveData);
      
      // Navigate to donation drives list on success
      navigate('/dashboard/donation-drives');
    } catch (err) {
      console.error('Error creating donation drive:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create donation drive');
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Create Donation Drive</h1>
        <p className="text-gray-600">Schedule a new blood donation event</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Drive Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                placeholder="e.g. Community Blood Drive"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                placeholder="e.g. City Hospital, 123 Main St"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                placeholder="Provide details about the donation drive"
              />
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              />
            </div>

            {/* Organizer */}
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
                Organizer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              />
            </div>

            {/* Organizer Contact Info */}
            <div>
              <label htmlFor="organizerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Organizer Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="organizerPhone"
                name="organizerPhone"
                value={formData.organizerPhone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                placeholder="Contact phone number"
              />
            </div>
            <div>
              <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Organizer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="organizerEmail"
                name="organizerEmail"
                value={formData.organizerEmail}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                placeholder="Contact email address"
              />
            </div>

            {/* Blood Types */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Needed Blood Types (Leave empty for all types)
              </label>
              <div className="flex flex-wrap gap-3">
                {availableBloodTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`bloodType-${type}`}
                      checked={formData.bloodTypes.includes(type)}
                      onChange={() => handleBloodTypeChange(type)}
                      className="h-4 w-4 text-[#c70000] focus:ring-[#c70000] border-gray-300 rounded"
                    />
                    <label htmlFor={`bloodType-${type}`} className="ml-2 text-sm text-gray-700">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/donation-drives')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#c70000] hover:bg-[#a00000] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDonationDrive;
