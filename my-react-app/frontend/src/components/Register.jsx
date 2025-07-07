import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// For debugging purposes
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const { register, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Unknown');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    phoneNumber: '',
    address: '',
    healthConditions: '',
    availableDays: [],
    roles: ['user'] // Must match case in backend's AuthController switch statement
  });

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  // Function to test backend connectivity
  const testBackendConnection = async () => {
    try {
      setBackendStatus('Testing connection...');
      // Testing connection with OPTIONS request which should be permitted by CORS
      const response = await axios({
        method: 'OPTIONS',
        url: 'http://localhost:8081/api/auth/signup',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type'
        }
      });
      setBackendStatus(`Connected! Status: ${response.status}`);
      console.log('Backend connection successful');
      return true;
    } catch (err) {
      console.error('Backend connection test failed:', err);
      if (err.code === 'ERR_NETWORK') {
        setBackendStatus('Backend server is not running - please start the server');
      } else {
        setBackendStatus(`Failed to connect: ${err.status || err.message}`);
      }
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Debug the data being sent
    console.log('Sending registration data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      bloodType: formData.bloodType,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      healthConditions: formData.healthConditions,
      availableDays: formData.availableDays,
      roles: formData.roles
    });
    
    try {
      // Format the data to match exactly what the backend expects
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        bloodType: formData.bloodType,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        healthConditions: formData.healthConditions,
        availableDays: formData.availableDays,
        // Backend expects roles as a simple array, not a Set
        roles: formData.roles
      };
      
      console.log('Attempting to register user...');
      const result = await register(userData);
      console.log('Registration result:', result);
      
      if (result.success) {
        setSuccess(true);
        console.log('Registration successful, redirecting to signin page');
        // Redirect to login after successful registration
        navigate('/signin');
      } else {
        console.error('Registration failed:', result.error);
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error details:', err);
      console.error('Error message:', err.message);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        setError(`Server error: ${err.response.data.message || err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        console.error('Request made but no response received:', err.request);
        setError('No response received from server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          availableDays: [...prev.availableDays, name],
        };
      } else {
        return {
          ...prev,
          availableDays: prev.availableDays.filter(day => day !== name),
        };
      }
    });
  };

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Backend connection test button */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Backend Status: 
                <span className={`font-medium ${backendStatus.includes('not running') ? 'text-red-600' : 'text-blue-600'}`}>
                  {backendStatus}
                </span>
              </span>
              <button
                type="button"
                onClick={testBackendConnection}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Test Connection
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}
            
            {/* Show success message if registration succeeded */}
            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">
                  Registration successful! Redirecting to login...
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                Blood Type
              </label>
              <div className="mt-1">
                <select
                  id="bloodType"
                  name="bloodType"
                  required
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
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
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days for Donation
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center">
                    <input
                      id={day}
                      name={day}
                      type="checkbox"
                      checked={formData.availableDays.includes(day)}
                      onChange={handleDayChange}
                      className="h-4 w-4 text-[#c70000] focus:ring-[#c70000] border-gray-300 rounded"
                    />
                    <label htmlFor={day} className="ml-2 block text-sm text-gray-700">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="healthConditions" className="block text-sm font-medium text-gray-700">
                Health Conditions
              </label>
              <div className="mt-1">
                <textarea
                  id="healthConditions"
                  name="healthConditions"
                  rows={3}
                  placeholder="List any health conditions or medications (optional)"
                  value={formData.healthConditions}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c70000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c70000]"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;
