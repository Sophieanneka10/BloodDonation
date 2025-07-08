const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8081;
const JWT_SECRET = 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Data directory setup
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir);
    console.log('Created data directory');
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Helper functions for data persistence
const readDataFile = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
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
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Initialize data files
const initializeData = () => {
  const files = [
    'users.json',
    'blood-requests.json',
    'notifications.json',
    'donation-drives.json',
    'donation-history.json',
    'messages.json'
  ];

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
      writeDataFile(file, []);
      console.log(`📄 Created ${file}`);
    }
  });

  // Check existing users
  const users = readDataFile('users.json');
  console.log(`👥 Found ${users.length} registered users`);
  users.forEach(user => {
    console.log(`   - ${user.email} (${user.role})`);
  });
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Blood donation API is running' });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Blood donation API',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/signin', '/api/auth/signup', '/api/auth/profile'],
      users: ['/api/users'],
      bloodRequests: ['/api/blood-requests'],
      donationDrives: ['/api/donation-drives'],
      notifications: ['/api/notifications'],
      messages: ['/api/messages/conversations', '/api/messages/send'],
      donationHistory: ['/api/donations/history', '/api/donations/statistics']
    }
  });
});

// Users endpoint (for debugging - view registered users)
app.get('/api/users', authenticateToken, (req, res) => {
  try {
    // Only admin can view all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const users = readDataFile('users.json');
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      total: usersWithoutPasswords.length,
      users: usersWithoutPasswords
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const users = readDataFile('users.json');
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update current user profile
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { firstName, lastName, phone, bloodGroup, address, city, state, healthConditions } = req.body;
    const users = readDataFile('users.json');
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      phone: phone || users[userIndex].phone,
      bloodGroup: bloodGroup || users[userIndex].bloodGroup,
      address: address || users[userIndex].address,
      city: city || users[userIndex].city,
      state: state || users[userIndex].state,
      healthConditions: healthConditions || users[userIndex].healthConditions,
      updatedAt: new Date().toISOString()
    };
    
    const saved = writeDataFile('users.json', users);
    if (!saved) {
      return res.status(500).json({ message: 'Failed to update profile' });
    }
    
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Auth Routes
app.post('/api/auth/signin', async (req, res) => {
  try {
    console.log('Sign in attempt:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const users = readDataFile('users.json');
    const user = users.find(u => u.email === email && u.isActive);

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: userPassword, ...userWithoutPassword } = user;
    console.log('Successful login:', email);
    
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Sign up attempt:', { email: req.body.email });
    const { email, password, firstName, lastName, bloodGroup, phone, address, city, state, pincode } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const users = readDataFile('users.json');
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      bloodGroup: bloodGroup || '',
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    const saved = writeDataFile('users.json', users);

    if (!saved) {
      return res.status(500).json({ message: 'Failed to save user' });
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: userPassword, ...userWithoutPassword } = newUser;
    console.log('Successful registration:', email);

    res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Blood Request Routes (basic implementations)
app.get('/api/blood-requests', authenticateToken, (req, res) => {
  try {
    const bloodRequests = readDataFile('blood-requests.json');
    res.json(bloodRequests);
  } catch (error) {
    console.error('Error getting blood requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/blood-requests/my', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Getting blood requests for user: ${userId}`);
    
    const bloodRequests = readDataFile('blood-requests.json');
    const userRequests = bloodRequests.filter(request => request.requesterId === userId);
    
    console.log(`Found ${userRequests.length} requests for user ${userId}`);
    res.json(userRequests);
  } catch (error) {
    console.error('Error getting user blood requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/blood-requests/statistics', authenticateToken, (req, res) => {
  try {
    console.log('Getting dashboard statistics...');
    const bloodRequests = readDataFile('blood-requests.json');
    const donationDrives = readDataFile('donation-drives.json');
    const donationHistory = readDataFile('donation-history.json');
    
    console.log(`Found ${bloodRequests.length} blood requests`);
    console.log(`Found ${donationDrives.length} donation drives`);
    console.log(`Found ${donationHistory.length} donation history entries`);
    
    // Count active blood requests
    const activeRequests = bloodRequests.filter(req => req.status === 'pending').length;
    
    // Count all donation drives - assume they're all active unless explicitly marked
    // This ensures at least the count shows up if there's any drive in the system
    const upcomingDrives = donationDrives.length > 0 ? donationDrives.length : 0;
    
    // Count emergency requests
    const emergencyRequests = bloodRequests.filter(req => 
      req.isEmergency === true || req.priority === 'emergency'
    ).length;
    
    const stats = {
      activeRequests,
      upcomingDrives,
      emergencyRequests,
      totalDonations: donationHistory.length
    };
    
    console.log('Dashboard statistics:', stats);
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting statistics:', error);
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

// Notification Routes (basic implementations)
app.get('/api/notifications', authenticateToken, (req, res) => {
  try {
    const notifications = readDataFile('notifications.json');
    const userNotifications = notifications.filter(n => n.userId === req.user.id);
    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Donation Drive Routes (basic implementations)
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

// Catch all other routes
app.all('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.url
  });
});

// ==============================================================================
// DONATION HISTORY ROUTES
// ==============================================================================

// Get user's donation history
app.get('/api/donations/history', authenticateToken, (req, res) => {
  try {
    const donations = readDataFile('donation-history.json');
    const userDonations = donations.filter(donation => donation.userId === req.user.id);
    
    // Sort by date descending (most recent first)
    userDonations.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
    
    res.json(userDonations);
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ message: 'Failed to fetch donation history' });
  }
});

// Add a new donation record
app.post('/api/donations/history', authenticateToken, (req, res) => {
  try {
    const { donationDate, location, bloodType, volume, notes, driveId } = req.body;
    
    // Validation
    if (!donationDate || !location || !bloodType) {
      return res.status(400).json({ message: 'Donation date, location, and blood type are required' });
    }
    
    const donations = readDataFile('donation-history.json');
    
    const newDonation = {
      id: uuidv4(),
      userId: req.user.id,
      donationDate: donationDate,
      location: location,
      bloodType: bloodType,
      volume: volume || 450, // Default to 450ml
      notes: notes || '',
      driveId: driveId || null,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };
    
    donations.push(newDonation);
    writeDataFile('donation-history.json', donations);
    
    // Update user's total donations count
    const users = readDataFile('users.json');
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
      users[userIndex].totalDonations = (users[userIndex].totalDonations || 0) + 1;
      users[userIndex].lastDonationDate = donationDate;
      writeDataFile('users.json', users);
    }
    
    res.status(201).json(newDonation);
  } catch (error) {
    console.error('Error adding donation record:', error);
    res.status(500).json({ message: 'Failed to add donation record' });
  }
});

// Get donation statistics for the user
app.get('/api/donations/statistics', authenticateToken, (req, res) => {
  try {
    const donations = readDataFile('donation-history.json');
    const userDonations = donations.filter(donation => donation.userId === req.user.id);
    
    const totalDonations = userDonations.length;
    const totalVolume = userDonations.reduce((sum, donation) => sum + (donation.volume || 450), 0);
    const lastDonation = userDonations.length > 0 ? 
      userDonations.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))[0] : null;
    
    // Calculate streak (consecutive donations within 6 months)
    let streak = 0;
    const sortedDonations = userDonations.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
    for (let i = 0; i < sortedDonations.length; i++) {
      const donationDate = new Date(sortedDonations[i].donationDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      if (donationDate >= sixMonthsAgo) {
        streak++;
      } else {
        break;
      }
    }
    
    res.json({
      totalDonations,
      totalVolume,
      lastDonation,
      streak,
      eligibleForNext: lastDonation ? 
        new Date() - new Date(lastDonation.donationDate) >= (56 * 24 * 60 * 60 * 1000) : // 56 days
        true
    });
  } catch (error) {
    console.error('Error fetching donation statistics:', error);
    res.status(500).json({ message: 'Failed to fetch donation statistics' });
  }
});

// Messaging API endpoints

// Get conversations for current user
app.get('/api/messages/conversations', authenticateToken, (req, res) => {
  try {
    const messages = readDataFile('messages.json');
    const userId = req.user.id;
    
    // Get unique conversations
    const conversations = new Map();
    
    messages.forEach(message => {
      if (message.senderId === userId || message.receiverId === userId) {
        const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
        const conversationKey = [userId, otherUserId].sort().join('-');
        
        if (!conversations.has(conversationKey) || 
            new Date(message.timestamp) > new Date(conversations.get(conversationKey).timestamp)) {
          conversations.set(conversationKey, {
            ...message,
            otherUserId,
            conversationId: conversationKey
          });
        }
      }
    });
    
    // Get user details for each conversation
    const users = readDataFile('users.json');
    const conversationList = Array.from(conversations.values()).map(conv => {
      const otherUser = users.find(u => u.id === conv.otherUserId);
      return {
        conversationId: conv.conversationId,
        otherUser: {
          id: otherUser?.id,
          firstName: otherUser?.firstName,
          lastName: otherUser?.lastName,
          email: otherUser?.email
        },
        lastMessage: {
          content: conv.content,
          timestamp: conv.timestamp,
          senderId: conv.senderId
        }
      };
    });
    
    conversationList.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
    
    res.json(conversationList);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

// Get messages for a specific conversation
app.get('/api/messages/conversation/:otherUserId', authenticateToken, (req, res) => {
  try {
    const messages = readDataFile('messages.json');
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    
    // Get messages between these two users
    const conversationMessages = messages.filter(message => 
      (message.senderId === userId && message.receiverId === otherUserId) ||
      (message.senderId === otherUserId && message.receiverId === userId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Get user details
    const users = readDataFile('users.json');
    const otherUser = users.find(u => u.id === otherUserId);
    
    res.json({
      otherUser: {
        id: otherUser?.id,
        firstName: otherUser?.firstName,
        lastName: otherUser?.lastName,
        email: otherUser?.email
      },
      messages: conversationMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send a new message
app.post('/api/messages/send', authenticateToken, (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;
    
    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }
    
    // Verify receiver exists
    const users = readDataFile('users.json');
    const receiver = users.find(u => u.id === receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
    
    const messages = readDataFile('messages.json');
    const newMessage = {
      id: uuidv4(),
      senderId,
      receiverId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    messages.push(newMessage);
    
    const saved = writeDataFile('messages.json', messages);
    if (!saved) {
      return res.status(500).json({ message: 'Failed to save message' });
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Mark messages as read
app.put('/api/messages/mark-read/:otherUserId', authenticateToken, (req, res) => {
  try {
    const messages = readDataFile('messages.json');
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    
    // Mark all messages from otherUserId to userId as read
    let updated = false;
    messages.forEach(message => {
      if (message.senderId === otherUserId && message.receiverId === userId && !message.read) {
        message.read = true;
        updated = true;
      }
    });
    
    if (updated) {
      const saved = writeDataFile('messages.json', messages);
      if (!saved) {
        return res.status(500).json({ message: 'Failed to update messages' });
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
});

// Search users for messaging
app.get('/api/messages/search-users', authenticateToken, (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;
    const users = readDataFile('users.json');
    
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    // Filter users excluding current user
    const filteredUsers = users.filter(user => {
      if (user.id === userId) return false;
      
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      
      return fullName.includes(searchTerm) || email.includes(searchTerm);
    }).map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }));
    
    res.json(filteredUsers.slice(0, 10)); // Limit to 10 results
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// Get registrations for a donation drive (organizer only)
app.get('/api/donation-drives/:id/registrations', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const driveId = req.params.id;
    console.log('Fetching registrations for drive:', driveId);
    console.log('Authenticated user:', userId);
    
    const drives = readDataFile('donation-drives.json');
    console.log(`Found ${drives.length} drives in the system`);
    
    // Log all drive IDs to help debugging
    console.log('Available drive IDs:', drives.map(d => d.id));
    
    // Always use string comparison for IDs
    const drive = drives.find(d => String(d.id) === String(driveId));
    
    console.log('Drive found:', !!drive);
    
    if (!drive) {
      return res.status(404).json({ 
        message: 'Donation drive not found', 
        debug: { 
          driveId,
          availableDriveIds: drives.map(d => d.id)
        } 
      });
    }
    
    // Get the user's role from the users file
    const allUsers = readDataFile('users.json');
    const currentUser = allUsers.find(u => String(u.id) === String(userId));
    
    // Get current user role
    const userRole = currentUser?.role || 'donor';
    const isAdmin = userRole === 'admin';
    const isOrganizer = userRole === 'organizer';
    
    // Convert both IDs to string to ensure proper type comparison
    const organizedIdStr = String(drive.organizerId);
    const userIdStr = String(userId);
    
    // Check if user is the drive owner
    const isDriveOwner = organizedIdStr === userIdStr;
    
    console.log('Registration access check:', {
      driveId: drive.id,
      driveName: drive.name,
      driveOrganizerId: organizedIdStr,
      currentUserId: userIdStr,
      isDriveOwner,
      userRole,
      isAdmin,
      isOrganizer
    });
    
    // Allow access if user is the organizer of this drive, has an organizer role, or is an admin
    const hasAccess = isDriveOwner || isAdmin || isOrganizer;
    
    console.log('Access decision:', {
      isDriveOwner,
      isOrganizer,
      isAdmin,
      hasAccess
    });
    
    if (!hasAccess) {
      return res.status(403).json({ 
        message: 'Access denied. Only the drive owner, organizers, and admins can view registrations.',
        debug: {
          driveOrganizerId: drive.organizerId,
          currentUserId: userId,
          userRole,
          isDriveOwner,
          isOrganizer,
          isAdmin
        }
      });
    }
    
    const users = readDataFile('users.json');
    const registrations = drive.registrations || [];
    
    // Get detailed user info for registered users
    const registeredUsers = registrations.map(registration => {
      const user = users.find(u => u.id === registration.userId);
      if (!user) return null;
      
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bloodType: user.bloodType,
        registrationDate: registration.registrationDate,
        emergencyContact: user.emergencyContact,
        medicalConditions: user.medicalConditions
      };
    }).filter(Boolean);
    
    // Get basic info for potential donors (users with matching blood type who haven't registered)
    const potentialDonors = users.filter(user => {
      if (user.id === userId) return false; // Exclude organizer
      if (registrations.some(r => r.userId === user.id)) return false; // Exclude already registered
      
      // Check if blood type matches what's needed
      const neededTypes = drive.bloodTypesNeeded || [];
      return neededTypes.includes(user.bloodType) && user.availableForDonation;
    }).map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      bloodType: user.bloodType,
      lastDonationDate: user.lastDonationDate
    }));
    
    res.json({
      drive: {
        id: drive.id,
        title: drive.title,
        date: drive.date,
        bloodTypesNeeded: drive.bloodTypesNeeded
      },
      registeredUsers,
      potentialDonors,
      stats: {
        registered: registeredUsers.length,
        potential: potentialDonors.length
      }
    });
  } catch (error) {
    console.error('Error getting drive registrations:', error);
    res.status(500).json({ message: 'Failed to get registrations' });
  }
});

// Get responders for a blood request (requester only)
app.get('/api/blood-requests/:id/responders', authenticateToken, (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;
    
    const requests = readDataFile('blood-requests.json');
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    // Check if user is the requester
    console.log('Request responder check:', {
      requestId: request.id,
      requestRequesterId: request.requesterId,
      currentUserId: userId,
      requesterIdType: typeof request.requesterId,
      userIdType: typeof userId,
      isEqual: request.requesterId === userId
    });
    
    if (request.requesterId !== userId) {
      return res.status(403).json({ 
        message: 'Only the requester can view responders',
        debug: {
          requestRequesterId: request.requesterId,
          currentUserId: userId,
          requesterIdType: typeof request.requesterId,
          userIdType: typeof userId
        }
      });
    }
    
    const users = readDataFile('users.json');
    const responses = request.responses || [];
    
    // Get detailed info for users who responded
    const responders = responses.map(response => {
      const user = users.find(u => u.id === response.userId);
      if (!user) return null;
      
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bloodType: user.bloodType,
        responseDate: response.responseDate,
        emergencyContact: user.emergencyContact,
        lastDonationDate: user.lastDonationDate,
        medicalConditions: user.medicalConditions
      };
    }).filter(Boolean);
    
    // Get basic info for potential donors (users with matching blood type who haven't responded)
    const potentialDonors = users.filter(user => {
      if (user.id === userId) return false; // Exclude requester
      if (responses.some(r => r.userId === user.id)) return false; // Exclude already responded
      
      // Check if blood type matches what's needed
      return user.bloodType === request.bloodType && user.availableForDonation;
    }).map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      bloodType: user.bloodType,
      lastDonationDate: user.lastDonationDate
    }));
    
    res.json({
      request: {
        id: request.id,
        title: request.title,
        bloodType: request.bloodType,
        urgency: request.urgency,
        deadline: request.deadline
      },
      responders,
      potentialDonors,
      stats: {
        responded: responders.length,
        potential: potentialDonors.length
      }
    });
  } catch (error) {
    console.error('Error getting request responders:', error);
    res.status(500).json({ message: 'Failed to get responders' });
  }
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Register new users at: http://localhost:${PORT}/api/auth/signup`);
  console.log(`🔐 Login at: http://localhost:${PORT}/api/auth/signin`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

// Initialize data on startup
initializeData();

console.log('🚀 Starting Blood Donation API Server...');
