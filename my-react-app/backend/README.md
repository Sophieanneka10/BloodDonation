# Blood Donation Backend API

A Node.js/Express backend API for the blood donation web application that uses local JSON file storage instead of a database.

## Features

- **Authentication**: JWT-based authentication with signup/signin endpoints
- **Blood Requests**: Create, read, update, delete blood requests with status tracking
- **Donation Drives**: Manage donation drives with registration/unregistration
- **Notifications**: User notifications with read/unread status
- **Local Storage**: Uses JSON files for data persistence (no database required)
- **CORS Enabled**: Ready for React frontend integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Blood Requests
- `GET /api/blood-requests` - Get all blood requests
- `GET /api/blood-requests/my` - Get current user's requests
- `POST /api/blood-requests` - Create new blood request
- `GET /api/blood-requests/:id` - Get specific blood request
- `PUT /api/blood-requests/:id` - Update blood request
- `PATCH /api/blood-requests/:id/status` - Update request status
- `DELETE /api/blood-requests/:id` - Delete blood request
- `GET /api/blood-requests/statistics` - Get request statistics

### Donation Drives
- `GET /api/donation-drives` - Get all donation drives
- `GET /api/donation-drives/my` - Get current user's drives
- `GET /api/donation-drives/:id` - Get specific donation drive
- `POST /api/donation-drives` - Create new donation drive
- `PUT /api/donation-drives/:id` - Update donation drive
- `DELETE /api/donation-drives/:id` - Delete donation drive
- `POST /api/donation-drives/:id/register` - Register for drive
- `DELETE /api/donation-drives/:id/register` - Unregister from drive

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/:id` - Get specific notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

## Default Credentials

The system creates a default admin user:
- **Email**: admin@redweb.com
- **Password**: password123

## Data Storage

Data is stored in JSON files in the `data/` directory:
- `users.json` - User accounts
- `blood-requests.json` - Blood requests
- `donation-drives.json` - Donation drives
- `notifications.json` - User notifications

## Configuration

The server runs on port 8081 by default. You can change this by setting the `PORT` environment variable.

JWT secret can be set via the `JWT_SECRET` environment variable (defaults to 'your-secret-key-here').

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Request authorization middleware
- User ownership validation for resources
