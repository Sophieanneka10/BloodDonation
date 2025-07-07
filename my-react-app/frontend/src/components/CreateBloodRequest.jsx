import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bloodRequestAPI } from '../services/api';

function CreateBloodRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    bloodType: '',
    units: 1,
    urgency: 'NORMAL',
    hospital: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await bloodRequestAPI.createRequest(formData);
      navigate('/dashboard/blood-requests');
    } catch (err) {
      console.error('Error creating blood request:', err);
      setError(err.response?.data?.message || 'Failed to create blood request. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create Blood Request</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details below to create a new blood request.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                Blood Type Required
              </label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] rounded-md"
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
            </div>

            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700">
                Units Required
              </label>
              <input
                type="number"
                name="units"
                id="units"
                min="1"
                value={formData.units}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                Urgency Level
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] rounded-md"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                Hospital Name
              </label>
              <input
                type="text"
                name="hospital"
                id="hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                name="patientName"
                id="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={4}
              value={formData.additionalInfo}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
              placeholder="Any additional details about the request..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/blood-requests')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c70000]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c70000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c70000]"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBloodRequest;
