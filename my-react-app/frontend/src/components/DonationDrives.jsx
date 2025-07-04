import { useState } from 'react';
import { Link } from 'react-router-dom';

function DonationDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Donation Drives</h1>
          <h2 className="text-lg text-gray-600">Upcoming Donation Drives</h2>
        </div>
        <Link 
          to="new"
          className="px-4 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000] transition-colors duration-200 inline-flex items-center"
        >
          <span className="mr-2">+</span>
          New Drive
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c70000]"></div>
        </div>
      ) : drives.length > 0 ? (
        <div className="grid gap-4">
          {drives.map((drive) => (
            <div key={drive.id} className="bg-white rounded-lg shadow p-4">
              {/* Drive details will go here */}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
          <p className="text-lg font-medium mb-2">No Donation Drives</p>
          <p className="text-gray-500 text-sm mb-4">There are no upcoming donation drives at the moment.</p>
          <Link 
            to="new"
            className="px-4 py-2 bg-[#c70000] text-white rounded-md hover:bg-[#a00000] transition-colors duration-200 inline-flex items-center"
          >
            Create Drive
          </Link>
        </div>
      )}
    </div>
  );
}

export default DonationDrives;
