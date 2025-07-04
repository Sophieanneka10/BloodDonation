import { useState } from 'react';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
        <h2 className="text-lg text-gray-600">Notifications</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f84444]"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg shadow p-4">
              {/* Notification details will go here */}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
          <p className="text-lg font-medium mb-2">No Notifications</p>
          <p className="text-gray-500 text-sm">You don't have any notifications at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default Notifications;
