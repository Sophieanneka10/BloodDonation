import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Blood Request API
export const bloodRequestAPI = {
  getAllRequests: () => api.get('/blood-requests'),
  getMyRequests: () => api.get('/blood-requests/my'),
  createRequest: (requestData) => api.post('/blood-requests', requestData),
  getRequestById: (id) => api.get(`/blood-requests/${id}`),
  updateRequest: (id, requestData) => api.put(`/blood-requests/${id}`, requestData),
  changeStatus: (id, status) => api.patch(`/blood-requests/${id}/status`, { status }),
  deleteRequest: (id) => api.delete(`/blood-requests/${id}`),
  getStatistics: () => api.get('/blood-requests/statistics')
};

// Notification API
export const notificationAPI = {
  getAllNotifications: () => api.get('/notifications'),
  getNotificationById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Donation Drive API
export const donationDriveAPI = {
  getAllDrives: () => api.get('/donation-drives'),
  getMyDrives: () => api.get('/donation-drives/my'),
  getDriveById: (id) => api.get(`/donation-drives/${id}`),
  createDrive: (driveData) => api.post('/donation-drives', driveData),
  updateDrive: (id, driveData) => api.put(`/donation-drives/${id}`, driveData),
  deleteDrive: (id) => api.delete(`/donation-drives/${id}`),
  registerForDrive: (id) => api.post(`/donation-drives/${id}/register`),
  unregisterFromDrive: (id) => api.delete(`/donation-drives/${id}/register`),
};

// Donation History API
export const donationHistoryAPI = {
  getHistory: () => api.get('/donations/history'),
  addDonation: (donationData) => api.post('/donations/history', donationData),
  getStatistics: () => api.get('/donations/statistics'),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (otherUserId) => api.get(`/messages/conversation/${otherUserId}`),
  sendMessage: (messageData) => api.post('/messages/send', messageData),
  markAsRead: (otherUserId) => api.put(`/messages/mark-read/${otherUserId}`),
  searchUsers: (query) => api.get(`/messages/search-users?query=${encodeURIComponent(query)}`),
};

// Organizer API
export const organizerAPI = {
  getDriveRegistrations: (driveId) => api.get(`/donation-drives/${driveId}/registrations`),
  getRequestResponders: (requestId) => api.get(`/blood-requests/${requestId}/responders`),
};

export default api;
