import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EmergencyRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodType: '',
    units: '',
    urgency: '',
    location: '',
    neededDate: '',
    neededTime: '',
    reason: '',
    notes: '',
    contactEmail: true,
    contactPhone: false,
    contactApp: true,
    shareContact: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle emergency request submission here
    navigate('/dashboard/emergency');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create Blood Request</h1>
      <div className="bg-white border rounded-xl p-8 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Blood Type Required</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
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
              <label className="block text-sm font-medium mb-1">Units Needed</label>
              <input
                type="number"
                name="units"
                value={formData.units}
                onChange={handleChange}
                min="1"
                placeholder="e.g., 2 units"
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urgency Level</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
              >
                <option value="">Select urgency level</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hospital or clinic name"
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Needed By (Date)</label>
              <input
                type="date"
                name="neededDate"
                value={formData.neededDate}
                onChange={handleChange}
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Needed By (Time)</label>
              <input
                type="time"
                name="neededTime"
                value={formData.neededTime}
                onChange={handleChange}
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Reason for Request</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly describe why the blood is needed"
              required
              className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional information that might be helpful"
              className="w-full border-gray-300 rounded-md focus:ring-[#c70000] focus:border-[#c70000]"
            />
          </div>

          <div className="mb-8">
            <div className="block text-sm font-medium mb-2">Contact Preferences</div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="contactEmail"
                  checked={formData.contactEmail}
                  onChange={handleChange}
                  className="mr-2"
                />
                Contact me by email
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="contactPhone"
                  checked={formData.contactPhone}
                  onChange={handleChange}
                  className="mr-2"
                />
                Contact me by phone
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="contactApp"
                  checked={formData.contactApp}
                  onChange={handleChange}
                  className="mr-2"
                />
                Contact me through the app
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="shareContact"
                  checked={formData.shareContact}
                  onChange={handleChange}
                  className="mr-2"
                />
                Share my contact information with potential donors
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/emergency')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c70000]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-sm font-medium text-white bg-[#c70000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c70000]"
            >
              Create Blood Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmergencyRequest; 