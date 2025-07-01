import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  title: '',
  organizer: '',
  date: '',
  startTime: '',
  endTime: '',
  venue: '',
  address: '',
  city: '',
  bloodTypes: [],
  urgent: false,
  description: '',
  additional: '',
};

const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

function CreateDonationDrive() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'bloodTypes') {
      setForm((prev) => ({
        ...prev,
        bloodTypes: checked
          ? [...prev.bloodTypes, value]
          : prev.bloodTypes.filter((b) => b !== value),
      }));
    } else if (name === 'urgent') {
      setForm((prev) => ({ ...prev, urgent: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setForm(initialForm);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create Donation Drive</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details below to create a new donation drive.
        </p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">Donation drive created successfully!</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Community Blood Drive"
              required
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm mb-2"
            />
            <input
              type="text"
              name="organizer"
              value={form.organizer}
              onChange={handleChange}
              placeholder="Organization or individual name"
              required
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm mb-2"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm"
              />
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm"
              />
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="e.g., Community Center"
                required
                className="border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm"
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street address"
                required
                className="border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm"
              />
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City name"
                required
                className="border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Types Needed</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {BLOOD_TYPES.map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="bloodTypes"
                      value={type}
                      checked={form.bloodTypes.includes(type)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  name="urgent"
                  checked={form.urgent}
                  onChange={handleChange}
                  className="mr-2"
                />
                Urgent need for specific blood type
              </label>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide details about the donation drive"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm mb-2"
            />
            <textarea
              name="additional"
              value={form.additional}
              onChange={handleChange}
              rows={2}
              placeholder="Any additional information for donors"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#f84444] focus:border-[#f84444] sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/donation-drives')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84444]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#f84444] hover:bg-[#d63a3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84444]"
            >
              Create Donation Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDonationDrive; 