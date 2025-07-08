import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { donationDriveAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function DonationDriveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDriveDetails = async () => {
      setLoading(true);
      try {
        const response = await donationDriveAPI.getDriveById(id);
        setDrive(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching drive details:', err);
        setError('Failed to load drive details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchDriveDetails();
  }, [id]);
  
  const registerForDrive = async () => {
    try {
      await donationDriveAPI.registerForDrive(id);
      // Update the drive data to show the user as registered
      setDrive(prev => ({
        ...prev,
        isRegistered: true,
        participants: [...(prev.participants || []), currentUser.id]
      }));
    } catch (err) {
      console.error('Error registering for drive:', err);
      setError('Failed to register for this drive. Please try again.');
    }
  };
  
  const unregisterFromDrive = async () => {
    try {
      await donationDriveAPI.unregisterFromDrive(id);
      // Update the drive data to show the user as not registered
      setDrive(prev => ({
        ...prev,
        isRegistered: false,
        participants: (prev.participants || []).filter(pid => pid !== currentUser.id)
      }));
    } catch (err) {
      console.error('Error unregistering from drive:', err);
      setError('Failed to cancel registration. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c70000]"></div>
        <span className="ml-2 text-gray-500">Loading drive details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md mb-6">
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
        <button
          onClick={() => navigate(-1)}
          className="text-[#c70000] hover:text-[#a00000]"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Drive not found</h3>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-[#c70000] hover:text-[#a00000]"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const isOrganizer = currentUser?.id === drive.organizerId;
  const driveDate = new Date(drive.date);
  const isPastDrive = driveDate < new Date();
  const isFull = (drive.participants?.length || 0) >= (drive.capacity || 50);

  return (
    <div className="p-6">
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-[#c70000] hover:text-[#a00000] flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Drives
        </button>
        
        {isOrganizer && (
          <div className="flex space-x-2">
            <Link 
              to={`/dashboard/donation-drives/${id}/edit`}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Edit Drive
            </Link>
            <Link 
              to={`/dashboard/donation-drives/${id}/registrations`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              View Registrations
            </Link>
          </div>
        )}
      </div>

      {/* Drive Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Date box */}
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center md:w-48 h-48">
            <span className="text-gray-500 font-medium">
              {driveDate.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className="text-5xl font-bold text-gray-800 my-1">
              {driveDate.getDate()}
            </span>
            <span className="text-gray-500 font-medium">
              {driveDate.toLocaleDateString('en-US', { month: 'long' })}
            </span>
            <span className="text-gray-500">
              {driveDate.getFullYear()}
            </span>
            <div className="mt-3 text-sm text-gray-600">
              {drive.startTime} - {drive.endTime}
            </div>
          </div>
          
          {/* Drive info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{drive.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm mb-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{drive.location}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{drive.organizer}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{drive.organizerPhone || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>{drive.organizerEmail || "N/A"}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                  isPastDrive ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"
                }`}>
                  {isPastDrive ? "Completed" : "Upcoming"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Capacity:</span>
                <span className="ml-2">
                  {(drive.participants?.length || 0)}/{drive.capacity || "Unlimited"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Blood Types:</span>
                <span className="ml-2">
                  {drive.bloodTypes?.join(', ') || 'All types'}
                </span>
              </div>
            </div>
            
            {/* Registration status and action buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {!isPastDrive && (
                <>
                  {drive.isRegistered ? (
                    <>
                      <div className="text-green-600 font-medium flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        You are registered
                      </div>
                      <button
                        onClick={unregisterFromDrive}
                        className="px-4 py-2 border border-[#c70000] text-[#c70000] rounded-md hover:bg-red-50"
                      >
                        Cancel Registration
                      </button>
                    </>
                  ) : isFull ? (
                    <div className="text-gray-500 font-medium">
                      This drive is full
                    </div>
                  ) : (
                    <button
                      onClick={registerForDrive}
                      className="px-4 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000]"
                    >
                      Register Now
                    </button>
                  )}
                </>
              )}
              
              {!isOrganizer && (
                <button
                  onClick={() => navigate('/dashboard/messages')}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                >
                  Message Organizer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drive details content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Description */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About This Drive</h2>
            <div className="prose max-w-none text-gray-700">
              <p>{drive.description}</p>
            </div>
          </div>
          
          {drive.requirements && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Donor Requirements</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{drive.requirements}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Location and other info */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <address className="not-italic text-gray-700 mb-4">
              {drive.location}<br />
              {drive.address && <>{drive.address}<br /></>}
              {(drive.city || drive.state) && <>{drive.city}, {drive.state}<br /></>}
            </address>
            
            {/* Here you could add a Google Maps embed if you have the coordinates */}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>{drive.organizer}</span>
              </li>
              {drive.organizerPhone && (
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>{drive.organizerPhone}</span>
                </li>
              )}
              {drive.organizerEmail && (
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>{drive.organizerEmail}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationDriveDetails;
