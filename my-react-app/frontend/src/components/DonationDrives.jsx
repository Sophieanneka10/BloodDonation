import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { donationDriveAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function DonationDrives() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchDrives = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (activeTab === 'my') {
          response = await donationDriveAPI.getMyDrives();
        } else {
          response = await donationDriveAPI.getAllDrives();
        }
        setDrives(response.data);
        setFilteredDrives(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching donation drives:', err);
        setError('Failed to load donation drives. Please try again.');
        setLoading(false);
      }
    };
    
    fetchDrives();
  }, [activeTab]);
  
  // Filter drives based on activeTab
  useEffect(() => {
    if (!drives.length) return;
    
    let filtered = [...drives];
    
    if (activeTab === 'upcoming') {
      const now = new Date();
      filtered = filtered.filter(drive => new Date(drive.date) >= now);
    } else if (activeTab === 'past') {
      const now = new Date();
      filtered = filtered.filter(drive => new Date(drive.date) < now);
    }
    
    setFilteredDrives(filtered);
  }, [drives, activeTab]);
  
  const registerForDrive = async (driveId) => {
    try {
      await donationDriveAPI.registerForDrive(driveId);
      // Update the drive in the list to show the user as registered
      setDrives(prevDrives => 
        prevDrives.map(drive => 
          drive.id === driveId 
            ? { ...drive, isRegistered: true, participants: [...drive.participants, currentUser.id] } 
            : drive
        )
      );
    } catch (err) {
      console.error('Error registering for drive:', err);
      alert('Failed to register for this drive. Please try again.');
    }
  };
  
  const unregisterFromDrive = async (driveId) => {
    try {
      await donationDriveAPI.unregisterFromDrive(driveId);
      // Update the drive in the list to show the user as not registered
      setDrives(prevDrives => 
        prevDrives.map(drive => 
          drive.id === driveId 
            ? { 
                ...drive, 
                isRegistered: false,
                participants: drive.participants.filter(id => id !== currentUser.id)
              } 
            : drive
        )
      );
    } catch (err) {
      console.error('Error unregistering from drive:', err);
      alert('Failed to unregister from this drive. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Donation Drives</h1>
          <h2 className="text-lg text-gray-600">Find and register for blood donation events</h2>
        </div>
        <Link 
          to="/dashboard/donation-drives/new"
          className="px-4 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000] transition-colors duration-200 inline-flex items-center"
        >
          <span className="mr-2">+</span>
          New Drive
        </Link>
      </div>
      
      {/* Tabs for filtering drives */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 text-sm font-medium ${
              activeTab === 'upcoming'
                ? 'text-[#c70000] border-b-2 border-[#c70000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Drives
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-4 text-sm font-medium ${
              activeTab === 'past'
                ? 'text-[#c70000] border-b-2 border-[#c70000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Drives
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`py-4 text-sm font-medium ${
              activeTab === 'my'
                ? 'text-[#c70000] border-b-2 border-[#c70000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Registrations
          </button>
        </div>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c70000]"></div>
          <span className="ml-2 text-gray-500">Loading drives...</span>
        </div>
      ) : filteredDrives.length > 0 ? (
        <div className="grid gap-4">
          {filteredDrives.map((drive) => (
            <div key={drive.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="md:flex">
                {/* Left section with date */}
                <div className="bg-[#f8f8f8] p-6 flex flex-col items-center justify-center md:w-48">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      {new Date(drive.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {new Date(drive.date).getDate()}
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      {new Date(drive.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {drive.startTime} - {drive.endTime}
                    </p>
                  </div>
                </div>
                
                {/* Middle section with details */}
                <div className="p-6 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{drive.title}</h3>
                  <p className="text-gray-500 mb-4">{drive.location}</p>
                  <p className="text-gray-600 mb-4">{drive.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Organizer:</span>
                      <span className="ml-1">{drive.organizer}</span>
                    </div>
                    {drive.organizerPhone && (
                      <div>
                        <span className="font-medium text-gray-500">Phone:</span>
                        <span className="ml-1">{drive.organizerPhone}</span>
                      </div>
                    )}
                    {drive.organizerEmail && (
                      <div>
                        <span className="font-medium text-gray-500">Email:</span>
                        <span className="ml-1">{drive.organizerEmail}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-500">Slots:</span>
                      <span className="ml-1">{drive.participants?.length || 0}/{drive.capacity}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Blood Types:</span>
                      <span className="ml-1">{drive.bloodTypes?.join(', ') || 'All types'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right section with actions */}
                <div className="p-6 md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200">
                  {new Date(drive.date) > new Date() ? (
                    drive.isRegistered ? (
                      <>
                        <div className="mb-4 text-center text-sm text-green-600">You are registered</div>
                        <button
                          onClick={() => unregisterFromDrive(drive.id)}
                          className="w-full py-2 px-4 border border-[#c70000] text-[#c70000] rounded-md hover:bg-red-50 transition-colors duration-200"
                        >
                          Cancel Registration
                        </button>
                      </>
                    ) : drive.participants?.length >= drive.capacity ? (
                      <div className="text-center text-sm text-gray-500">This drive is full</div>
                    ) : (
                      <button
                        onClick={() => registerForDrive(drive.id)}
                        className="w-full py-2 px-4 bg-[#c70000] text-white rounded-md hover:bg-[#a00000] transition-colors duration-200"
                      >
                        Register
                      </button>
                    )
                  ) : (
                    <div className="text-center text-sm text-gray-500">This drive has ended</div>
                  )}
                  
                  <button
                    onClick={() => navigate(`/dashboard/donation-drives/${drive.id}`)}
                    className="mt-3 w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    View Details
                  </button>
                  
                  {/* Message organizer button */}
                  <button
                    onClick={() => navigate('/dashboard/messages')}
                    className="mt-2 w-full py-2 px-4 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    Message Organizer
                  </button>
                  
                  {/* View registrations button for organizers */}
                  {currentUser?.id === drive.organizerId && (
                    <button
                      onClick={() => navigate(`/dashboard/donation-drives/${drive.id}/registrations`)}
                      className="mt-2 w-full py-2 px-4 border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors duration-200"
                    >
                      View Registrations
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
          <p className="text-lg font-medium mb-2">No Donation Drives Found</p>
          <p className="text-gray-500 text-sm mb-4">
            {activeTab === 'upcoming' && 'There are no upcoming donation drives at the moment.'}
            {activeTab === 'past' && 'There are no past donation drives to display.'}
            {activeTab === 'my' && 'You are not registered for any donation drives.'}
          </p>
          {(currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_ORGANIZER')) && (
            <Link 
              to="/dashboard/donation-drives/new"
              className="px-4 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000] transition-colors duration-200 inline-flex items-center"
            >
              Create Drive
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default DonationDrives;
