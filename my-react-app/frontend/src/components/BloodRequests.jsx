import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bloodRequestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function BloodRequests() {
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bloodType: '',
    urgency: '',
    status: ''
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        
        if (activeTab === 'all') {
          response = await bloodRequestAPI.getAllRequests();
        } else {
          response = await bloodRequestAPI.getMyRequests();
        }
        
        setRequests(response.data);
        setFilteredRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blood requests:', error);
        setError('Failed to fetch blood requests. Please try again.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, [activeTab]);
  
  // Filter requests based on search term and filters
  useEffect(() => {
    if (!requests.length) return;
    
    let result = [...requests];
    
    // Filter by search term (hospital name or requester name)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(request => 
        request.hospital?.toLowerCase().includes(lowerSearchTerm) ||
        `${request.requester?.firstName || ''} ${request.requester?.lastName || ''}`.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply filters
    if (filters.bloodType) {
      result = result.filter(request => request.bloodType === filters.bloodType);
    }
    
    if (filters.urgency) {
      result = result.filter(request => request.urgency === filters.urgency);
    }
    
    if (filters.status) {
      result = result.filter(request => request.status === filters.status);
    }
    
    setFilteredRequests(result);
  }, [requests, searchTerm, filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      bloodType: '',
      urgency: '',
      status: ''
    });
  };

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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Blood Requests</h1>
          <h2 className="text-lg text-gray-600">Manage blood requests and donations</h2>
        </div>
        <Link
          to="/dashboard/blood-requests/new"
          className="px-4 py-2 bg-[#c70000] text-white rounded hover:bg-[#a00000] transition-colors duration-200"
        >
          Create Request
        </Link>
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
      
      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by hospital or requester name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000]"
            />
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select
              id="bloodType"
              name="bloodType"
              value={filters.bloodType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000]"
            >
              <option value="">All Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              id="urgency"
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000]"
            >
              <option value="">All Urgencies</option>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000]"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        {(searchTerm || filters.bloodType || filters.urgency || filters.status) && (
          <div className="mt-3 flex justify-end">
            <button 
              onClick={clearFilters}
              className="text-sm text-[#c70000] hover:text-[#a00000]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c70000] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
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
        <div>
          {searchTerm || filters.bloodType || filters.urgency || filters.status ? (
            filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900">No Matching Requests</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BloodRequests;
