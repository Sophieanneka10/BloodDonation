import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bloodRequestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function BloodRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bloodType: '',
    units: 1,
    urgency: 'NORMAL',
    hospital: '',
    notes: ''
  });

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true);
      try {
        const response = await bloodRequestAPI.getRequestById(id);
        setRequest(response.data);
        setEditForm({
          bloodType: response.data.bloodType,
          units: response.data.units,
          urgency: response.data.urgency,
          hospital: response.data.hospital,
          notes: response.data.notes || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching request details:', err);
        setError('Failed to load request details. Please try again.');
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'units' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bloodRequestAPI.updateRequest(id, editForm);
      const updatedRequest = await bloodRequestAPI.getRequestById(id);
      setRequest(updatedRequest.data);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error('Error updating request:', err);
      setError('Failed to update request. Please try again.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await bloodRequestAPI.changeStatus(id, newStatus);
      const updatedRequest = await bloodRequestAPI.getRequestById(id);
      setRequest(updatedRequest.data);
      setLoading(false);
    } catch (err) {
      console.error('Error changing request status:', err);
      setError('Failed to change request status. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blood request?')) {
      setLoading(true);
      try {
        await bloodRequestAPI.deleteRequest(id);
        navigate('/dashboard/blood-requests');
      } catch (err) {
        console.error('Error deleting request:', err);
        setError('Failed to delete request. Please try again.');
        setLoading(false);
      }
    }
  };

  const isOwner = request && currentUser && request.requester && request.requester.id === currentUser.id;
  const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes('ROLE_ADMIN');
  const canEdit = isOwner || isAdmin;

  if (loading && !request) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c70000]"></div>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md">
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
          onClick={() => navigate('/dashboard/blood-requests')}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Blood Requests
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {isEditing ? 'Edit Blood Request' : 'Blood Request Details'}
          </h1>
          <p className="text-gray-600">
            {request && `Request ID: ${request.id}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/dashboard/blood-requests')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          {canEdit && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-[#c70000] rounded-md shadow-sm text-sm font-medium text-[#c70000] bg-white hover:bg-red-50"
            >
              Edit
            </button>
          )}
          {canEdit && (
            <button 
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700"
            >
              Delete
            </button>
          )}
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

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={editForm.bloodType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                >
                  <option value="">Select Blood Type</option>
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
              
              <div>
                <label htmlFor="units" className="block text-sm font-medium text-gray-700">
                  Units Needed
                </label>
                <input
                  type="number"
                  name="units"
                  id="units"
                  min="1"
                  value={editForm.units}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-[#c70000] focus:border-[#c70000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                  Urgency
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={editForm.urgency}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                  Hospital
                </label>
                <input
                  type="text"
                  name="hospital"
                  id="hospital"
                  value={editForm.hospital}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-[#c70000] focus:border-[#c70000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={editForm.notes}
                  onChange={handleChange}
                  className="mt-1 focus:ring-[#c70000] focus:border-[#c70000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c70000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c70000]"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{request?.bloodType}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Units Needed</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{request?.units}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Urgency</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full
                    ${request?.urgency === 'LOW' && 'bg-blue-100 text-blue-800'}
                    ${request?.urgency === 'NORMAL' && 'bg-green-100 text-green-800'}
                    ${request?.urgency === 'HIGH' && 'bg-yellow-100 text-yellow-800'}
                    ${request?.urgency === 'CRITICAL' && 'bg-red-100 text-red-800'}
                  `}>
                    {request?.urgency}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full
                    ${request?.status === 'PENDING' && 'bg-yellow-100 text-yellow-800'}
                    ${request?.status === 'FULFILLED' && 'bg-green-100 text-green-800'}
                    ${request?.status === 'CANCELLED' && 'bg-gray-100 text-gray-800'}
                  `}>
                    {request?.status}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Hospital</dt>
                <dd className="mt-1 text-sm text-gray-900">{request?.hospital}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Requested By</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request?.requester ? `${request.requester.firstName} ${request.requester.lastName}` : 'Unknown'}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request?.createdAt && new Date(request.createdAt).toLocaleString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request?.updatedAt && new Date(request.updatedAt).toLocaleString()}
                </dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {request?.notes || 'No additional notes provided.'}
                </dd>
              </div>
            </dl>

            {/* View Responders Button for Request Creator */}
            {currentUser?.id === request?.userId && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Manage Request</h3>
                <div className="mt-2">
                  <button
                    onClick={() => navigate(`/dashboard/blood-requests/${request.id}/responders`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    View Responders
                  </button>
                </div>
              </div>
            )}

            {/* Status Change Buttons */}
            {canEdit && request?.status !== 'FULFILLED' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Update Status</h3>
                <div className="mt-2 flex space-x-3">
                  {request?.status !== 'PENDING' && (
                    <button
                      onClick={() => handleStatusChange('PENDING')}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium"
                    >
                      Mark as Pending
                    </button>
                  )}
                  {request?.status !== 'FULFILLED' && (
                    <button
                      onClick={() => handleStatusChange('FULFILLED')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium"
                    >
                      Mark as Fulfilled
                    </button>
                  )}
                  {request?.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleStatusChange('CANCELLED')}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm font-medium"
                    >
                      Mark as Cancelled
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BloodRequestDetails;
