import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizerAPI } from '../services/api';

const DriveRegistrations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await organizerAPI.getDriveRegistrations(id);
      setData(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You can only view registrations for your own donation drives.');
      } else if (err.response?.status === 404) {
        setError('Donation drive not found.');
      } else {
        setError('Failed to load registrations.');
      }
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastDonation = (dateString) => {
    if (!dateString) return 'Never donated';
    const date = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 30) return `${daysDiff} days ago`;
    if (daysDiff < 365) return `${Math.floor(daysDiff / 30)} months ago`;
    return `${Math.floor(daysDiff / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c70000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/donation-drives')}
              className="px-4 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000] transition-colors duration-200"
            >
              Back to Donation Drives
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.drive.title}</h1>
              <p className="text-gray-600 mt-1">
                Drive Date: {formatDate(data.drive.date)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Blood Types Needed: {data.drive.bloodTypesNeeded?.join(', ') || 'All types'}
              </p>
            </div>
            <button
              onClick={() => navigate('/donation-drives')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Back to Drives
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{data.stats.registered}</p>
                <p className="text-gray-600">Registered Donors</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{data.stats.potential}</p>
                <p className="text-gray-600">Potential Donors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('registered')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'registered'
                    ? 'border-[#c70000] text-[#c70000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
              >
                Registered Donors ({data.stats.registered})
              </button>
              <button
                onClick={() => setActiveTab('potential')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'potential'
                    ? 'border-[#c70000] text-[#c70000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
              >
                Potential Donors ({data.stats.potential})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'registered' ? (
              <div>
                {data.registeredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No registered donors yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {data.registeredUsers.map((user) => (
                      <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#c70000] rounded-full flex items-center justify-center text-white font-medium">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-sm text-gray-600">{user.phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              {user.bloodType}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Registered: {formatDate(user.registrationDate)}
                            </p>
                          </div>
                        </div>
                        
                        {(user.emergencyContact || user.medicalConditions) && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            {user.emergencyContact && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Emergency Contact:</span> {user.emergencyContact}
                              </p>
                            )}
                            {user.medicalConditions && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Medical Conditions:</span> {user.medicalConditions}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {data.potentialDonors.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No potential donors available</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Note:</span> These are users with matching blood types who are available for donation but haven't registered yet. Contact information is limited for privacy.
                      </p>
                    </div>
                    <div className="grid gap-4">
                      {data.potentialDonors.map((user) => (
                        <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Last Donation: {formatLastDonation(user.lastDonationDate)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {user.bloodType}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveRegistrations;
