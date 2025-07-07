# RedWeb Blood Donation Platform

A full-stack web application for managing blood donations, requests, and donation drives. This application connects blood donors with those in need and helps organize blood donation events.

## Project Structure

This repository is organized as a monorepo with two main directories:

- `frontend/` - React-based web interface
- `backend/` - Spring Boot API server

## Technologies Used

### Frontend
- React 19 with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication
- Vite for build tooling

### Backend
- Java 17
- Spring Boot 3.2.2
- Spring Security with JWT Authentication
- Spring Data JPA
- MySQL Database
- Gradle Build System

## Getting Started

### Prerequisites
- Node.js 18+ and npm for the frontend
- Java JDK 17+ for the backend
- WAMP/XAMPP with MySQL for the database

### Setup and Running

#### Database
1. Start your WAMP/XAMPP server
2. Make sure MySQL is running on the default port (3306)
3. The backend will automatically create the `redwebdb` database if it doesn't exist

#### Backend
1. Navigate to the backend directory: `cd backend`
2. Build the project: `./gradlew build`
3. Run the server: `./gradlew bootRun`
4. The API will be available at http://localhost:8081/api

#### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. The frontend will be available at http://localhost:5173

## Features

- User authentication (sign up, sign in)
- Blood donation request management
- Donation drive organization
- Real-time notifications
- Emergency blood requests
- Dashboard with statistics

## License

This project is available under the MIT License.
