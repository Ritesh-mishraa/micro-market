# Micro Marketplace App

A full-stack marketplace application with Web (React), Backend (Node.js/Express), and Mobile (React Native) components.

## Features
- **User Authentication**: Register and Login with JWT.
- **Product Management**: Browse, Search, and View details of products.
- **Favorites**: Users can mark products as favorites (persisted).
- **Cross-Platform**: Web and Mobile interfaces.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Web**: React, Vite, CSS Modules (Vanilla), Axios, React Router
- **Mobile**: React Native, Expo, React Navigation

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Expo Go App (for mobile testing)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/micro-marketplace
# JWT_SECRET=your_secret_key
# PORT=5000

# Seed Database (Optional)
node seed.js

# Start Server
node server.js
```
Server runs on `http://localhost:5000`.

### 2. Web App Setup
```bash
cd web
npm install
npm run dev
```
Web app runs on `http://localhost:5173`.

### 3. Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with Expo Go app.
*Note: Ensure your mobile device is on the same network as your PC. Update `BASE_URL` in `mobile/src/api/axios.js` to your PC's IP address if needed.*

## Deployment

### Mobile App (Easy Evaluation)
To evaluate the mobile app without setting up a full development environment:
1.  Navigate to `mobile` directory.
2.  Install EAS CLI: `npm install -g eas-cli`
3.  Login to Expo: `eas login`
4.  Publish update:
    ```bash
    eas update --branch production
    ```
5.  This will publish the JS bundle to Expo's servers.

For full deployment instructions (Render + Expo Build), see [DEPLOYMENT.md](DEPLOYMENT.md).

## API Endpoints

### Auth
- `POST /auth/register`: Register new user `{ username, email, password }`
- `POST /auth/login`: Login `{ email, password }`
- `GET /auth/me`: Get current user info (requires token)

### Products
- `GET /products`: List products (Query params: `page`, `limit`, `search`)
- `GET /products/:id`: Get product details
- `PUT /products/like/:id`: Add to favorites (requires token)
- `PUT /products/unlike/:id`: Remove from favorites (requires token)

## Project Structure
- `backend/`: Server and Database logic
- `web/`: React Frontend
- `mobile/`: React Native (Expo) App
