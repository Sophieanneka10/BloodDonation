import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignIn() {
  const navigate = useNavigate();
  const { login, currentUser, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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
    setError('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <div className="bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-bold text-[#c70000]">RedWeb</Link>
                <div className="flex items-center gap-6">
                  <Link to="/" className="text-gray-600 hover:text-[#c70000]">Home</Link>
                  <Link to="/about" className="text-gray-600 hover:text-[#c70000]">About</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-[#c70000]">Contact</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/signin" className="text-[#c70000] font-medium">Sign In</Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-[#c70000] text-white rounded hover:bg-[#a00000] transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 py-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#c70000] flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
              Sign in to your account
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              Or{' '}
              <Link to="/register" className="font-medium text-[#c70000] hover:text-[#a00000]">
                register a new account
              </Link>
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">
                    {error}
                  </div>
                </div>
              )}
              
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#c70000] focus:border-[#c70000] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#c70000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c70000] transition-colors"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignIn;
