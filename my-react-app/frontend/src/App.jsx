import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c70000]"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  return children;
}

function AppRoutes() {
  const { logout } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard onSignOut={logout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
