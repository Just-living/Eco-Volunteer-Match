# Eco-Volunteer Match - Project Overview

## What is this project?
An eco-volunteering platform where users can:
- Find nearby environmental events (cleanup, planting, recycling)
- Join events and earn points
- Share experiences in a community feed
- Redeem points for eco-friendly rewards
- View events on an interactive map

## Technologies Used

### Frontend (React)
- **React 19** - Modern UI framework
- **React Router** - Navigation between pages
- **Leaflet/React-Leaflet** - Interactive maps
- **Axios** - API calls to backend
- **Vite** - Build tool and dev server

### Backend (Node.js)
- **Express** - Web server framework
- **MongoDB/Mongoose** - Database for storing users, events, posts, rewards
- **JWT** - User authentication (secure login)
- **Multer** - File uploads for post images
- **Sharp** - Image compression/optimization
- **bcrypt** - Password encryption

## Key Features Implemented

### 1. User Authentication
- Registration and login system
- Secure password hashing
- JWT token-based authentication
- Protected routes (can't access pages without login)

### 2. Event Management
- Browse events by category (cleanup, planting, recycling)
- Search events by name/location
- View events on interactive map with geolocation
- Join events to earn points
- 25+ sample events in database

### 3. Community Feed
- Create posts with text and photos
- Like/unlike posts
- Delete your own posts
- See posts from all users
- Image compression (optimizes photos automatically)

### 4. Rewards System
- Earn points by joining events
- Redeem points for eco-friendly rewards
- 15 different rewards available
- Points balance tracking

### 5. Map Integration
- Interactive map showing nearby events
- User location detection
- Radius filter (5km, 10km, 15km, 25km)
- Distance calculation from user to events

## Project Structure

```
eco-volunteer-match/
├── src/                    # Frontend React code
│   ├── pages/             # Different pages (Dashboard, Map, Community, etc.)
│   ├── components/        # Reusable UI components
│   ├── context/           # React context for authentication
│   ├── services/          # API service functions
│   └── styles.css         # Global styles
│
└── server/                # Backend Node.js code
    ├── src/
    │   ├── models/        # Database models (User, Event, Post, Reward)
    │   ├── routes/        # API endpoints
    │   ├── middleware/    # Authentication & file upload middleware
    │   └── index.js       # Server entry point
```

## Database Models

1. **User** - Stores user info, points, badges, joined events
2. **Event** - Stores event details with geolocation (lat/lng)
3. **Post** - Community posts with images and likes
4. **Reward** - Available rewards with point costs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - List all events (with search/filter)
- `GET /api/events/near` - Find events near location
- `POST /api/events/:id/join` - Join an event

### Posts
- `GET /api/posts` - Get all community posts
- `POST /api/posts` - Create new post (with image upload)
- `POST /api/posts/:id/like` - Like/unlike a post
- `DELETE /api/posts/:id` - Delete your own post

### Rewards
- `GET /api/rewards` - List all rewards
- `POST /api/rewards/:id/redeem` - Redeem a reward

## Security Features

1. **Password Encryption** - Passwords are hashed with bcrypt
2. **JWT Authentication** - Secure token-based login
3. **Authorization** - Users can only delete their own posts
4. **Input Validation** - Server validates all inputs
5. **File Upload Security** - Image type and size validation

## What You Learned (Talking Points)

1. **Full-Stack Development** - Built both frontend and backend
2. **RESTful APIs** - Created API endpoints for all features
3. **Database Design** - Designed MongoDB schemas for different data types
4. **Authentication** - Implemented secure user login system
5. **File Uploads** - Handled image uploads with compression
6. **Geolocation** - Integrated maps and location-based features
7. **State Management** - Used React hooks and context for data flow
8. **Error Handling** - Added proper error handling throughout

## How to Run the Project

1. **Start MongoDB** (must be running locally)
2. **Backend**: `cd server && npm install && npm run dev`
3. **Frontend**: `npm install && npm run dev`
4. **Seed Database**: `cd server && npm run seed` (adds sample data)

## Demo Credentials

- Email: `sarah@example.com`
- Password: `demo`

Or create your own account!

## Future Improvements (If Asked)

- Email notifications
- Event comments/reviews
- Social sharing
- Mobile app version
- Admin dashboard
- Event creation by users
