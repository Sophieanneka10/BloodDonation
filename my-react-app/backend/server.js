const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8081;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data directory
const dataDir = path.join(__dirname, 'data');
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
} catch (error) {
  console.error('Error creating data directory:', error);
  process.exit(1);
}

// Helper functions for data persistence
const readDataFile = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

const writeDataFile = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
  }
};

// Initialize data files
const initializeDataFiles = () => {
  try {
    const files = [
      { name: 'users.json', defaultData: [] },
      { name: 'blood-requests.json', defaultData: [] },
      { name: 'notifications.json', defaultData: [] },
      { name: 'donation-drives.json', defaultData: [] }
    ];

    files.forEach(file => {
      const filePath = path.join(dataDir, file.name);
      if (!fs.existsSync(filePath)) {
        writeDataFile(file.name, file.defaultData);
      }
    });

    // Create default admin user if no users exist
    const users = readDataFile('users.json');
    if (users.length === 0) {
      const hashedPassword = bcrypt.hashSync('password123', 10);
      const defaultUser = {
        id: uuidv4(),
        email: 'admin@redweb.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        bloodGroup: 'O+',
        phone: '1234567890',
        address: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        pincode: '123456',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      writeDataFile('users.json', [defaultUser]);
      console.log('Created default admin user: admin@redweb.com');
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/signin', (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readDataFile('users.json');
    
    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: userPassword, ...userWithoutPassword } = user;
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password, firstName, lastName, bloodGroup, phone, address, city, state, pincode } = req.body;
    const users = readDataFile('users.json');
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      bloodGroup,
      phone,
      address,
      city,
      state,
      pincode,
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeDataFile('users.json', users);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: userPassword, ...userWithoutPassword } = newUser;
    res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Blood Request Routes
app.get('/api/blood-requests', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    res.json(bloodRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/blood-requests/my', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    const userRequests = bloodRequests.filter(request => request.userId === req.user.id);
    res.json(userRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/blood-requests', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    const newRequest = {
      id: uuidv4(),
      userId: req.user.id,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bloodRequests.push(newRequest);
    writeDataFile('blood-requests.json', bloodRequests);
    
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/blood-requests/:id', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    const request = bloodRequests.find(r => r.id === req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/blood-requests/:id', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    const requestIndex = bloodRequests.findIndex(r => r.id === req.params.id);
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    // Check if user owns the request or is admin
    if (bloodRequests[requestIndex].userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    bloodRequests[requestIndex] = {
      ...bloodRequests[requestIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    writeDataFile('blood-requests.json', bloodRequests);
    res.json(bloodRequests[requestIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.patch('/api/blood-requests/:id/status', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    const requestIndex = bloodRequests.findIndex(r => r.id === req.params.id);
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    bloodRequests[requestIndex].status = req.body.status;
    bloodRequests[requestIndex].updatedAt = new Date().toISOString();
    
    writeDataFile('blood-requests.json', bloodRequests);
    res.json(bloodRequests[requestIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/blood-requests/:id', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    const requestIndex = bloodRequests.findIndex(r => r.id === req.params.id);
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    // Check if user owns the request or is admin
    if (bloodRequests[requestIndex].userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    bloodRequests.splice(requestIndex, 1);
    writeDataFile('blood-requests.json', bloodRequests);
    
    res.json({ message: 'Blood request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/blood-requests/statistics', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    const statistics = {
      total: bloodRequests.length,
      pending: bloodRequests.filter(r => r.status === 'pending').length,
      fulfilled: bloodRequests.filter(r => r.status === 'fulfilled').length,
      cancelled: bloodRequests.filter(r => r.status === 'cancelled').length
    };
    
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Notification Routes
app.get('/api/notifications', authenticateToken, (req, res) => {
  try {
    const notifications = readDataFile('notifications.json');
    const userNotifications = notifications.filter(n => n.userId === req.user.id);
    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/notifications/:id', authenticateToken, (req, res) => {
  try {
    const notifications = readDataFile('notifications.json');
    const notification = notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  try {
    const notifications = readDataFile('notifications.json');
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id && n.userId === req.user.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notifications[notificationIndex].isRead = true;
    notifications[notificationIndex].readAt = new Date().toISOString();
    
    writeDataFile('notifications.json', notifications);
    res.json(notifications[notificationIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/notifications/mark-all-read', authenticateToken, (req, res) => {
  try {
    const notifications = readDataFile('notifications.json');
    const updatedNotifications = notifications.map(n => {
      if (n.userId === req.user.id && !n.isRead) {
        return {
          ...n,
          isRead: true,
          readAt: new Date().toISOString()
        };
      }
      return n;
    });
    
    writeDataFile('notifications.json', updatedNotifications);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/notifications/:id', authenticateToken, (req, res) => {
  try {
    const notifications = readDataFile('notifications.json');
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id && n.userId === req.user.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notifications.splice(notificationIndex, 1);
    writeDataFile('notifications.json', notifications);
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Donation Drive Routes
app.get('/api/donation-drives', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    res.json(donationDrives);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/donation-drives/my', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    const userDrives = donationDrives.filter(drive => drive.organizerId === req.user.id);
    res.json(userDrives);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/donation-drives/:id', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    const drive = donationDrives.find(d => d.id === req.params.id);
    
    if (!drive) {
      return res.status(404).json({ message: 'Donation drive not found' });
    }
    
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/donation-drives', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    const newDrive = {
      id: uuidv4(),
      organizerId: req.user.id,
      ...req.body,
      registeredDonors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    donationDrives.push(newDrive);
    writeDataFile('donation-drives.json', donationDrives);
    
    res.status(201).json(newDrive);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/donation-drives/:id', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    const driveIndex = donationDrives.findIndex(d => d.id === req.params.id);
    
    if (driveIndex === -1) {
      return res.status(404).json({ message: 'Donation drive not found' });
    }
    
    // Check if user owns the drive or is admin
    if (donationDrives[driveIndex].organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    donationDrives[driveIndex] = {
      ...donationDrives[driveIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    writeDataFile('donation-drives.json', donationDrives);
    res.json(donationDrives[driveIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/donation-drives/:id', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    const driveIndex = donationDrives.findIndex(d => d.id === req.params.id);
    
    if (driveIndex === -1) {
      return res.status(404).json({ message: 'Donation drive not found' });
    }
    
    // Check if user owns the drive or is admin
    if (donationDrives[driveIndex].organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    donationDrives.splice(driveIndex, 1);
    writeDataFile('donation-drives.json', donationDrives);
    
    res.json({ message: 'Donation drive deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/donation-drives/:id/register', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    const driveIndex = donationDrives.findIndex(d => d.id === req.params.id);
    
    if (driveIndex === -1) {
      return res.status(404).json({ message: 'Donation drive not found' });
    }
    
    const drive = donationDrives[driveIndex];
    
    // Check if user is already registered
    if (drive.registeredDonors.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered for this drive' });
    }
    
    drive.registeredDonors.push(req.user.id);
    drive.updatedAt = new Date().toISOString();
    
    writeDataFile('donation-drives.json', donationDrives);
    res.json({ message: 'Successfully registered for donation drive' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/donation-drives/:id/register', authenticateToken, (req, res) => {
  try {
    const donationDrives = readDataFile('donation-drives.json');
    const driveIndex = donationDrives.findIndex(d => d.id === req.params.id);
    
    if (driveIndex === -1) {
      return res.status(404).json({ message: 'Donation drive not found' });
    }
    
    const drive = donationDrives[driveIndex];
    const donorIndex = drive.registeredDonors.indexOf(req.user.id);
    
    if (donorIndex === -1) {
      return res.status(400).json({ message: 'User not registered for this drive' });
    }
    
    drive.registeredDonors.splice(donorIndex, 1);
    drive.updatedAt = new Date().toISOString();
    
    writeDataFile('donation-drives.json', donationDrives);
    res.json({ message: 'Successfully unregistered from donation drive' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Blood donation API is running' });
});

// Initialize data files on startup
initializeDataFiles();

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
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

module.exports = app;
