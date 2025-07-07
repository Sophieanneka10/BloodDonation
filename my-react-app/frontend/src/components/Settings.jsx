import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, donationDriveAPI } from '../services/api';

function Settings() {
  const { currentUser, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodType: '',
    address: '',
    city: '',
    state: '',
    availability: {
      weekdays: false,
      mornings: false,
      evenings: false
    },
    health: {
      medicalConditions: '',
      currentMedications: '',
      allergies: '',
      diabetes: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [donationDrives, setDonationDrives] = useState([]);
  const [drivesLoading, setDrivesLoading] = useState(true);

  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || currentUser.phoneNumber || '',
        bloodType: currentUser.bloodGroup || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        availability: {
          weekdays: currentUser.availability?.weekdays || false,
          mornings: currentUser.availability?.mornings || false,
          evenings: currentUser.availability?.evenings || false
        },
        health: {
          medicalConditions: currentUser.health?.medicalConditions || '',
          currentMedications: currentUser.health?.currentMedications || '',
          allergies: currentUser.health?.allergies || '',
          diabetes: currentUser.health?.diabetes || false
        }
      });
    }
  }, [currentUser]);

  // Fetch donation drives
  useEffect(() => {
    const fetchDonationDrives = async () => {
      try {
        setDrivesLoading(true);
        const response = await donationDriveAPI.getAllDrives();
        // Get upcoming drives (filter by date and limit to 3)
        const upcomingDrives = response.data
          .filter(drive => new Date(drive.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setDonationDrives(upcomingDrives);
      } catch (error) {
        console.error('Failed to fetch donation drives:', error);
        setDonationDrives([]);
      } finally {
        setDrivesLoading(false);
      }
    };

    fetchDonationDrives();
  }, []);

  // Refresh profile data on component mount
  useEffect(() => {
    refreshProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('availability.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [field]: checked
        }
      }));
    } else if (name.includes('health.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        health: {
          ...prev.health,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const updateData = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        bloodGroup: form.bloodType,
        address: form.address,
        city: form.city,
        state: form.state,
        availability: form.availability,
        health: form.health
      };
      
      const response = await authAPI.updateProfile(updateData);
      
      if (response.data) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        // Refresh the profile data in the context
        await refreshProfile();
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      setMessage(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (form.firstName || form.lastName) {
      return `${form.firstName?.charAt(0) || ''}${form.lastName?.charAt(0) || ''}`.toUpperCase();
    }
    return 'U';
  };

  const getTotalDonations = () => {
    // This would come from actual donation history
    return currentUser?.totalDonations || 0;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-[#c70000] bg-white border border-[#c70000] rounded-md hover:bg-red-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => {setIsEditing(false); setMessage('');}}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c70000] hover:bg-[#a00000]'
                }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-600">
                {getInitials()}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {form.firstName && form.lastName ? `${form.firstName} ${form.lastName}` : 'undefined undefined'}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Donor Since May 10, 2020</p>
              
              <div className="flex justify-center space-x-2 mb-4">
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Unknown</span>
                <span className="px-2 py-1 text-xs bg-red-600 text-white rounded">Bronze Donor</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Donations</span>
                  <span className="text-lg font-bold">{getTotalDonations()}</span>
                </div>
              </div>
              
              <div className="mt-4 text-left">
                <p className="text-sm text-[#c70000] font-medium mb-2">
                  {getTotalDonations() === 0 ? 'Ready to make your first donation?' : 'Keep up the great work!'}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {drivesLoading ? 'Loading upcoming drives...' : 
                   donationDrives.length > 0 ? 'Here are some upcoming donation drives' : 'No upcoming donation drives at the moment'}
                </p>
                
                {drivesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#c70000]"></div>
                  </div>
                ) : donationDrives.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {donationDrives.map((drive) => (
                      <div key={drive.id} className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <div>
                          <p className="font-medium">{drive.title}</p>
                          <p className="text-gray-500">
                            {new Date(drive.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })} • {drive.location || 'Location TBD'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-400">Check back later for new donation opportunities!</p>
                  </div>
                )}
                
                <button className="w-full mt-3 px-3 py-2 text-xs font-medium text-white bg-[#c70000] rounded hover:bg-[#a00000]">
                  View All Donation Drives
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-sm text-gray-600 mb-4">Manage your personal details and preferences</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">{form.firstName && form.lastName ? `${form.firstName} ${form.lastName}` : 'undefined undefined'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{form.email || 'user@example.com'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
                    />
                  ) : (
                    <p className="text-gray-900">{form.phone || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  {isEditing ? (
                    <select
                      name="bloodType"
                      value={form.bloodType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
                    >
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{form.bloodType || 'Select blood type'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability for Donation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="availability.weekdays"
                      checked={form.availability.weekdays}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4 text-[#c70000] border-gray-300 rounded focus:ring-[#c70000]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Weekdays</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">{form.availability.weekdays ? 'Available for emergency donations' : 'Not available'}</p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="availability.mornings"
                      checked={form.availability.mornings}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4 text-[#c70000] border-gray-300 rounded focus:ring-[#c70000]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mornings</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="availability.evenings"
                      checked={form.availability.evenings}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4 text-[#c70000] border-gray-300 rounded focus:ring-[#c70000]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Evenings</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Information</h3>
              <p className="text-sm text-gray-600 mb-4">Your health status and donation eligibility</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                  {isEditing ? (
                    <textarea
                      name="health.medicalConditions"
                      value={form.health.medicalConditions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
                      placeholder="List any medical conditions"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{form.health.medicalConditions || 'None reported'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      name="health.currentMedications"
                      value={form.health.currentMedications}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
                      placeholder="List any medications you are currently taking"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm">{form.health.currentMedications || 'None reported'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="health.allergies"
                      value={form.health.allergies}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
                      placeholder="List any allergies"
                    />
                  ) : (
                    <p className="text-gray-900">{form.health.allergies || 'None reported'}</p>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="health.diabetes"
                      checked={form.health.diabetes}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-4 h-4 text-[#c70000] border-gray-300 rounded focus:ring-[#c70000]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Diabetes</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 