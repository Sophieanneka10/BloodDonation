const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/api', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Blood donation API is running',
    endpoints: [
      'GET /api/health',
      'GET /api',
      'POST /api/auth/signin',
      'POST /api/auth/signup'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server is running' });
});

// Test auth endpoint
app.post('/api/auth/signin', (req, res) => {
  console.log('Sign in attempt:', req.body);
  const { email, password } = req.body;
  
  if (email === 'admin@redweb.com' && password === 'password123') {
    res.json({
      token: 'test-jwt-token-123',
      user: {
        id: '1',
        email: 'admin@redweb.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Catch all other routes
app.all('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.url,
    availableRoutes: ['/api', '/api/health', '/api/auth/signin']
  });
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Keep the process alive
setInterval(() => {
  console.log('Server still running...');
}, 30000);
