import React, { useState, useEffect } from 'react';
import { donationHistoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DonationHistory = () => {
  const { currentUser } = useAuth();
  const [donations, setDonations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchDonationData();
  }, []);

  const fetchDonationData = async () => {
    setLoading(true);
    try {
      const [historyResponse, statsResponse] = await Promise.all([
        donationHistoryAPI.getHistory(),
        donationHistoryAPI.getStatistics()
      ]);
      
      setDonations(historyResponse.data);
      setStatistics(statsResponse.data);
    } catch (error) {
      console.error('Error fetching donation data:', error);
      setError('Failed to load donation history');
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = () => {
    if (!currentUser) return 'U';
    return `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold text-lg">{getInitials()}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
                <p className="text-gray-600">Track your blood donation journey</p>
              </div>
            </div>

          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">❤️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Donations</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalDonations}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🩸</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalVolume}ml</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">🔥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.streak}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 ${statistics.eligibleForNext ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center`}>
                    <span className={`${statistics.eligibleForNext ? 'text-green-600' : 'text-yellow-600'} text-lg`}>
                      {statistics.eligibleForNext ? '✅' : '⏰'}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm font-bold text-gray-900">
                    {statistics.eligibleForNext ? 'Eligible to Donate' : 'Wait Period'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donation History List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Donation Records</h3>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {donations.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🩸</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-500 mb-4">Your donation history will appear here after you participate in donation drives and organizers confirm your donations.</p>
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-2">How donations are tracked:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Register for donation drives</li>
                  <li>• Attend and donate blood</li>
                  <li>• Organizers confirm your donation</li>
                  <li>• Your donation appears in this history automatically</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {donations.map((donation) => (
                <div key={donation.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-red-600 font-bold">{donation.bloodType}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{donation.location}</h4>
                        <p className="text-sm text-gray-500">{formatDate(donation.donationDate)}</p>
                        {donation.notes && (
                          <p className="text-sm text-gray-600 mt-1">{donation.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{donation.volume}ml</p>
                      <p className="text-sm text-gray-500">{donation.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
