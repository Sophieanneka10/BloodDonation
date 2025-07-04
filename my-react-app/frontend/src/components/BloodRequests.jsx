import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BloodRequests() {
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockData = [];
        setRequests(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blood requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [activeTab]);

  const filteredRequests = activeTab === 'all' 
    ? requests 
    : requests.filter(request => request.requestedBy === 'admin@redweb.com');

  const RequestCard = ({ request }) => (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#c70000]">{request.bloodType}</span>
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            {request.urgency}
          </span>
        </div>
        <span className="text-sm text-gray-500">{request.requestDate}</span>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-gray-600"><span className="font-medium">Units needed:</span> {request.units}</p>
        <p className="text-gray-600"><span className="font-medium">Hospital:</span> {request.hospital}</p>
        <p className="text-gray-600"><span className="font-medium">Status:</span> {request.status}</p>
      </div>
      <button
        onClick={() => navigate(`/dashboard/blood-requests/${request.id}`)}
        className="mt-4 w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Blood Requests</h1>
        <button
          onClick={() => navigate('/dashboard/blood-requests/new')}
          className="flex items-center px-4 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000]"
        >
          <span className="mr-1">+</span>
          New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`mr-8 py-4 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-[#c70000] border-b-2 border-[#c70000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`py-4 text-sm font-medium ${
              activeTab === 'my'
                ? 'text-[#c70000] border-b-2 border-[#c70000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Requests
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c70000] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900">No Blood Requests</h3>
          <p className="mt-2 text-gray-500">
            There are no blood requests at the moment.
          </p>
          <button
            onClick={() => navigate('/dashboard/blood-requests/new')}
            className="mt-6 px-6 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000]"
          >
            Create Request
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BloodRequests;
