import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('AuthContext: Attempting to register with data:', userData);
      setError(null);
      
      // First check if the backend is reachable
      try {
        // Convert Set to Array if needed
        if (userData.roles instanceof Set) {
          userData = {
            ...userData,
            roles: Array.from(userData.roles)
          };
        }
        
        const response = await authAPI.register(userData);
        console.log('AuthContext: Registration successful with response:', response);
        return { success: true, message: 'Registration successful!' };
      } catch (apiError) {
        console.error('AuthContext: API error during registration:', apiError);
        
        // Handle different types of errors
        if (apiError.code === 'ERR_NETWORK') {
          const errorMsg = 'Cannot connect to backend server. Please ensure the server is running at http://localhost:8081';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        } else if (apiError.response) {
          // Server responded with an error
          const errorMsg = apiError.response.data?.message || 
                          `Server error: ${apiError.response.status} ${apiError.response.statusText}`;
          setError(errorMsg);
          return { success: false, error: errorMsg };
        } else {
          setError('Registration failed due to an unknown error.');
          return { success: false, error: 'Unknown error during registration' };
        }
      }
    } catch (err) {
      console.error('AuthContext: Unexpected error in register function:', err);
      setError('An unexpected error occurred during registration.');
      return { success: false, error: 'Unexpected error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      return { success: true, data: userData };
    } catch (err) {
      console.error('Failed to refresh profile:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to load profile' };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
