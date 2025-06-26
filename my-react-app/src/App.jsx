import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';

// Static authentication - In a real app, this would be handled by a backend
const STATIC_AUTH = {
  email: 'admin@redweb.com',
  password: 'password123',
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard onSignOut={() => setIsAuthenticated(false)} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
