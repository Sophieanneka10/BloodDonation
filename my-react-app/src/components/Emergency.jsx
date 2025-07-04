import React, { useState } from 'react';
import EmergencyRequest from './EmergencyRequest';

function Emergency() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <EmergencyRequest />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Emergency Requests</h1>
      <div className="mb-6">
        <div className="flex items-start bg-red-100 border border-red-200 text-red-800 rounded-lg p-4">
          <span className="mr-3 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <div>
            <div className="font-semibold">Emergency Mode</div>
            <div className="text-sm">Emergency requests are urgent blood needs that require immediate attention. If you can help, please respond as soon as possible.</div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center py-24">
        <h2 className="text-lg font-semibold mb-2">No Emergency Requests</h2>
        <p className="text-gray-500 mb-6">There are no emergency blood requests at the moment.</p>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-[#f84444] text-white rounded-md hover:bg-[#d63a3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84444]"
        >
          Create Blood Request
        </button>
      </div>
    </div>
  );
}

export default Emergency; 