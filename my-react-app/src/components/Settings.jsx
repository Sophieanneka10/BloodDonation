import React, { useState } from 'react';

function Settings() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodType: '',
    address: '',
    health: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save changes logic here
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="bg-white border rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md focus:ring-[#f84444] focus:border-[#f84444]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled
                className="w-full border-gray-300 rounded-md bg-gray-100 focus:ring-[#f84444] focus:border-[#f84444]"
              />
              <span className="text-xs text-gray-400">Email cannot be changed</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md focus:ring-[#f84444] focus:border-[#f84444]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Blood Type</label>
              <input
                type="text"
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md focus:ring-[#f84444] focus:border-[#f84444]"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="w-full border-gray-300 rounded-md focus:ring-[#f84444] focus:border-[#f84444]"
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-medium mb-1">Health Conditions</label>
            <textarea
              name="health"
              value={form.health}
              onChange={handleChange}
              rows={2}
              placeholder="List any health conditions that might affect your ability to donate blood"
              className="w-full border-gray-300 rounded-md focus:ring-[#f84444] focus:border-[#f84444]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-sm font-medium text-white bg-[#f84444] hover:bg-[#d63a3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84444]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings; 