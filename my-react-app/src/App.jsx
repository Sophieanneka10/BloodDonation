import { useState } from 'react';
import { Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import SignIn from './components/SignIn';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import theme from './theme';

// Static authentication - In a real app, this would be handled by a backend
const STATIC_AUTH = {
  email: 'admin@redweb.com',
  password: 'password123',
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Navigation Bar - Only show on non-dashboard pages */}
        {!window.location.pathname.startsWith('/dashboard') && (
          <AppBar position="static" color="primary">
            <Container>
              <Toolbar>
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    flexGrow: 1,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  RedWeb
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                  <Button color="inherit" component={RouterLink} to="/">
                    Home
                  </Button>
                  <Button color="inherit">About</Button>
                  <Button color="inherit">Contact</Button>
                  {isAuthenticated ? (
                    <>
                      <Button color="inherit" component={RouterLink} to="/dashboard">
                        Dashboard
                      </Button>
                      <Button
                        color="inherit"
                        onClick={() => setIsAuthenticated(false)}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button color="inherit" component={RouterLink} to="/signin">
                        Sign In
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        component={RouterLink}
                        to="/register"
                      >
                        Register
                      </Button>
                    </>
                  )}
                </Box>
                <IconButton
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                  color="inherit"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <MenuIcon />
                </IconButton>
              </Toolbar>
            </Container>
          </AppBar>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signin"
            element={<SignIn onSignIn={() => setIsAuthenticated(true)} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard onLogout={() => setIsAuthenticated(false)} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;