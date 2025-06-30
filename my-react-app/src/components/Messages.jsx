import React, { useState } from 'react';

function Messages() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  // Simulate loading messages
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    // Here you would handle sending the message
    setMessage('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">New Message</h2>
          <form className="space-y-4" onSubmit={handleSend}>
            <div>
              <label className="block text-sm font-medium mb-1">To:</label>
              <input
                type="email"
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder="Recipient's email"
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#f84444] focus:border-[#f84444]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message:</label>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here..."
                required
                className="w-full border-gray-300 rounded-md focus:ring-[#f84444] focus:border-[#f84444]"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#f84444] text-white rounded-md hover:bg-[#d63a3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f84444]"
              >
                Send
              </button>
            </div>
          </form>
        </div>
        <h2 className="text-lg font-semibold mb-4">Your Messages</h2>
        <div className="flex justify-center items-center min-h-[120px]">
          {loading ? (
            <span className="text-gray-500">Loading messages...</span>
          ) : (
            <span className="text-gray-400">No messages yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages; 