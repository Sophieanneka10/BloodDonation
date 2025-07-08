import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import BloodRequests from './BloodRequests';
import CreateBloodRequest from './CreateBloodRequest';
import BloodRequestDetails from './BloodRequestDetails';
import DonationDrives from './DonationDrives';
import CreateDonationDrive from './CreateDonationDrive';
import DonationDriveDetails from './DonationDriveDetails';
import DriveRegistrations from './DriveRegistrations';
import RequestResponders from './RequestResponders';
import Notifications from './Notifications';
import Emergency from './Emergency';
import Messages from './Messages';
import Settings from './Settings';
import DonationHistory from './DonationHistory';
import { useAuth } from '../context/AuthContext';
import { bloodRequestAPI, donationDriveAPI } from '../services/api';

function Dashboard() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    activeRequests: 0,
    upcomingDrives: 0,
    emergencyRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDrives, setLoadingDrives] = useState(true);
  
  useEffect(() => {
    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
      try {
        const response = await bloodRequestAPI.getStatistics();
        if (response.data) {
          setDashboardStats({
            activeRequests: response.data.activeRequests || 0,
            upcomingDrives: response.data.upcomingDrives || 0,
            emergencyRequests: response.data.emergencyRequests || 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch recent blood requests
    const fetchRecentRequests = async () => {
      try {
        console.log('Fetching recent blood requests...');
        setLoadingRequests(true);
        const response = await bloodRequestAPI.getAllRequests();
        console.log('Blood requests API response:', response);
        if (response && response.length > 0) {
          // Sort by date and take the 3 most recent
          const sortedRequests = response
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
          console.log('Processed blood requests:', sortedRequests);
          setRecentRequests(sortedRequests);
        } else {
          console.log('No blood requests data found in response');
          setRecentRequests([]);
        }
      } catch (error) {
        console.error('Error fetching recent requests:', error);
        setRecentRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };

    // Fetch upcoming donation drives
    const fetchUpcomingDrives = async () => {
      try {
        console.log('Fetching upcoming donation drives...');
        setLoadingDrives(true);
        const response = await donationDriveAPI.getAllDrives();
        console.log('Donation drives API response:', response);
        if (response && response.length > 0) {
          // Filter upcoming drives (date is in the future) and take the 3 most recent
          const today = new Date();
          console.log('Current date for filtering:', today);
          const upcomingDrives = response
            .filter(drive => {
              const driveDate = new Date(drive.date);
              console.log(`Drive ${drive.id} date: ${driveDate}, is future: ${driveDate > today}`);
              return driveDate > today;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
          console.log('Processed upcoming drives:', upcomingDrives);
          setUpcomingDrives(upcomingDrives);
        } else {
          console.log('No donation drives data found in response');
          setUpcomingDrives([]);
        }
      } catch (error) {
        console.error('Error fetching upcoming drives:', error);
        setUpcomingDrives([]);
      } finally {
        setLoadingDrives(false);
      }
    };
    
    fetchDashboardStats();
    fetchRecentRequests();
    fetchUpcomingDrives();
  }, []);
  
  // If user is not logged in, redirect to signin page
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  const handleSignOut = async () => {
    await logout();
  };
  
  const menuItems = [
    { name: 'Overview', href: '', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    )},
    { name: 'Blood Requests', href: 'blood-requests', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Donation Drives', href: 'donation-drives', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Donation History', href: 'donation-history', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Messages', href: 'messages', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Notifications', href: 'notifications', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    )},
    { name: 'Emergency', href: 'emergency', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    )},
    { name: 'Settings', href: 'settings', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen border-r border-gray-200">
          <div className="p-4">
            <Link to="dashboard" className="text-2xl font-bold text-[#c70000]">RedWeb</Link>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="text-gray-500">{item.icon}</span>
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <Link to="help" className="block text-sm text-gray-600 hover:text-gray-900">
              Need Help?
            </Link>
            <button
              onClick={handleSignOut}
              className="mt-4 w-full px-4 py-2 bg-[#c70000] text-white rounded hover:bg-[#a00000] transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button className="text-gray-600 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="notifications"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  title="Notifications"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </Link>
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">
                    Hello, {currentUser?.firstName || 'User'}
                  </span>
                  <Link
                    to="settings"
                    className="px-4 py-2 mr-2 border border-[#c70000] text-[#c70000] rounded hover:bg-red-50 transition-colors duration-200"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-[#c70000] text-white rounded hover:bg-[#a00000] transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Routes */}
          <Routes>
            <Route index element={
              <main className="p-6">
                {/* Dashboard Welcome */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-[#c70000] bg-opacity-10 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#c70000]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h1>
                      <p className="text-gray-600">Track your donations, requests, and upcoming drives all in one place</p>
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {/* Blood Requests Card */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Blood Requests</h2>
                      <span className="text-[#c70000]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Your active requests</p>
                    <div className="text-3xl font-bold mb-4">{loading ? '...' : dashboardStats.activeRequests}</div>
                    <p className="text-sm text-gray-500 mb-4">
                      {loading ? 'Loading...' : 
                       dashboardStats.activeRequests === 0 ? 'No active blood requests' : 
                       `${dashboardStats.activeRequests} active request${dashboardStats.activeRequests !== 1 ? 's' : ''}`}
                    </p>
                    <Link to="blood-requests" className="text-[#c70000] text-sm hover:text-[#a00000]">
                      View all requests →
                    </Link>
                  </div>

                  {/* Donation Drives Card */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Donation Drives</h2>
                      <span className="text-[#c70000]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Upcoming drives</p>
                    <div className="text-3xl font-bold mb-4">{loading ? '...' : dashboardStats.upcomingDrives}</div>
                    <p className="text-sm text-gray-500 mb-4">
                      {loading ? 'Loading...' : 
                       dashboardStats.upcomingDrives === 0 ? 'No upcoming donation drives' : 
                       `${dashboardStats.upcomingDrives} upcoming drive${dashboardStats.upcomingDrives !== 1 ? 's' : ''}`}
                    </p>
                    <Link to="donation-drives" className="text-[#c70000] text-sm hover:text-[#a00000]">
                      View all drives →
                    </Link>
                  </div>

                  {/* Emergency Requests Card */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Emergency Requests</h2>
                      <span className="text-[#c70000]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Urgent blood needs</p>
                    <div className="text-3xl font-bold mb-4">{loading ? '...' : dashboardStats.emergencyRequests}</div>
                    <p className="text-sm text-gray-500 mb-4">
                      {loading ? 'Loading...' : 
                       dashboardStats.emergencyRequests === 0 ? 'No emergency requests' : 
                       `${dashboardStats.emergencyRequests} emergency request${dashboardStats.emergencyRequests !== 1 ? 's' : ''}`}
                    </p>
                    <Link to="emergency" className="text-[#c70000] text-sm hover:text-[#a00000]">
                      View emergencies →
                    </Link>
                  </div>
                </div>

                {/* Recent Activity Sections */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Recent Blood Requests */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Blood Requests</h2>
                    {loadingRequests ? (
                      <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#c70000]"></div>
                      </div>
                    ) : recentRequests.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {recentRequests.map(request => (
                          <div key={request.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">
                                  Blood Type: <span className="font-bold text-[#c70000]">{request.bloodType}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {request.urgency} urgency • {request.unitsNeeded} units needed
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Posted {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Link 
                                to={`/blood-requests/${request.id}`} 
                                className="text-sm text-[#c70000] hover:underline"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4">No recent blood requests</p>
                    )}
                    <Link to="blood-requests/new" className="px-4 py-2 bg-[#c70000] text-white rounded hover:bg-[#a00000] transition-colors inline-block">
                      Create Request
                    </Link>
                  </div>

                  {/* Upcoming Donation Drives */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Upcoming Donation Drives</h2>
                    {loadingDrives ? (
                      <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#c70000]"></div>
                      </div>
                    ) : upcomingDrives.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {upcomingDrives.map(drive => (
                          <div key={drive.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{drive.name}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(drive.date).toLocaleDateString()} • {drive.location}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Capacity: {drive.capacity || 'Unlimited'}
                                </div>
                              </div>
                              <Link 
                                to={`/donation-drives/${drive.id}`} 
                                className="text-sm text-[#c70000] hover:underline"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4">No upcoming donation drives</p>
                    )}
                    <Link to="donation-drives/new" className="px-4 py-2 bg-[#c70000] text-white rounded hover:bg-[#a00000] transition-colors inline-block">
                      Create Drive
                    </Link>
                  </div>
                </div>
              </main>
            } />
            <Route path="blood-requests" element={<BloodRequests />} />
            <Route path="blood-requests/new" element={<CreateBloodRequest />} />
            <Route path="blood-requests/:id" element={<BloodRequestDetails />} />
            <Route path="blood-requests/:id/responders" element={<RequestResponders />} />
            <Route path="donation-drives" element={<DonationDrives />} />
            <Route path="donation-drives/new" element={<CreateDonationDrive />} />
            <Route path="donation-drives/:id" element={<DonationDriveDetails />} />
            <Route path="donation-drives/:id/registrations" element={<DriveRegistrations />} />
            <Route path="donation-history" element={<DonationHistory />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
