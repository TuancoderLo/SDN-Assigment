# Perfume Store - MERN Stack Backend

## Overview

This is the backend API for the Perfume Store application built with Node.js, Express, MongoDB, and Mongoose.

## Features

### Authentication & Authorization

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Member)
- Protected routes

### Models

1. **Member Model**

   - Email, password (hashed), name, YOB, gender, isAdmin
   - Password comparison method
   - Automatic password hashing on save

2. **Brand Model**

   - Brand name with timestamps

3. **Perfume Model**

   - Complete perfume information (name, price, concentration, etc.)
   - Reference to Brand
   - Embedded comments with ratings
   - Population support for brand info

4. **Comment Schema** (embedded in Perfume)
   - Rating (1-5), content, author reference
   - Timestamps

## API Endpoints

### Public Routes (No Authentication Required)

#### Authentication

- `POST /api/auth/register` - Register new member
- `POST /api/auth/login` - Login member
- `GET /api/auth/me` - Get current user (requires auth)

#### Brands

- `GET /api/brands` - Get all brands
- `GET /api/brands/:brandId` - Get single brand

#### Perfumes

- `GET /api/perfumes` - Get all perfumes (supports filters)
  - Query params: `search`, `brand`, `targetAudience`, `concentration`
- `GET /api/perfumes/:perfumeId` - Get single perfume with full details

### Private Routes (Authentication Required)

#### Admin Only Routes

- `POST /api/brands` - Create brand
- `PUT /api/brands/:brandId` - Update brand
- `DELETE /api/brands/:brandId` - Delete brand
- `POST /api/perfumes` - Create perfume
- `PUT /api/perfumes/:perfumeId` - Update perfume
- `DELETE /api/perfumes/:perfumeId` - Delete perfume
- `GET /api/collectors` - Get all members (Admin only)

#### Member Routes (Self Only)

- `GET /api/members/:id` - Get member profile
- `PUT /api/members/:id` - Update member profile
- `PUT /api/members/:id/password` - Change password
- `GET /api/members/:id/comments` - Get member's comments

#### Comment Routes (Authenticated Members)

- `POST /api/perfumes/:perfumeId/comments` - Add comment (one per perfume)
- `PUT /api/perfumes/:perfumeId/comments/:commentId` - Update own comment
- `DELETE /api/perfumes/:perfumeId/comments/:commentId` - Delete own comment

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:
   Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/perfume_store
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

3. Seed the database with sample data:

```bash
node seed.js
```

4. Start the server:

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## Seed Data

The seed script creates:

- 1 Admin account
- 2 Member accounts
- 5 Brands (Dior, Chanel, Tom Ford, Creed, Versace)
- 9 Perfumes with complete details

### Default Accounts:

**Admin:**

- Email: admin@myteam.com
- Password: admin123

**Members:**

- Email: member1@test.com / Password: member123
- Email: member2@test.com / Password: member123

## Security Features

1. **Password Security**

   - Passwords are hashed using bcrypt with salt rounds
   - Passwords never returned in API responses

2. **JWT Authentication**

   - Tokens expire after 7 days (configurable)
   - Protected routes verify token validity

3. **Authorization Levels**

   - Public: Anyone can access
   - Member: Authenticated users only
   - Self: Only the account owner can access/modify
   - Admin: Only admin users can access

4. **Data Protection**
   - Members can only edit their own information
   - Even admins cannot edit other members' profiles
   - One comment per perfume per member

## Business Logic

### Member Operations

- Members can register and login
- Members can update their own profile (name, email, YOB, gender)
- Members can change their own password
- Members can view their own comments
- No one (including admins) can edit other members' information

### Comment/Feedback System

- Only authenticated members can comment
- Each member can only leave one comment per perfume
- Members can update or delete their own comments
- Comments include rating (1-5) and text content

### Admin Operations

- Full CRUD operations on brands
- Full CRUD operations on perfumes
- Can view all registered members
- Cannot edit other members' personal information

## Data Validation

All models include validation for:

- Required fields
- Data types
- Min/max values
- Unique constraints
- Email format validation

## Error Handling

- Consistent JSON error responses
- HTTP status codes (400, 401, 403, 404, 500)
- Descriptive error messages
- Validation error messages

## Testing the API

Use tools like Postman or Thunder Client to test endpoints:

1. Register a new member
2. Login to get JWT token
3. Use token in Authorization header: `Bearer <token>`
4. Test public routes (no token needed)
5. Test protected routes (token required)

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── brandController.js   # Brand CRUD operations
│   ├── perfumeController.js # Perfume & comment operations
│   ├── memberController.js  # Member profile operations
│   └── collectorController.js # Admin member listing
├── middleware/
│   └── auth.js              # Authentication & authorization
├── models/
│   ├── Member.js            # Member schema & model
│   ├── Brand.js             # Brand schema & model
│   └── Perfume.js           # Perfume schema & model
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── brandRoutes.js       # Brand endpoints
│   ├── perfumeRoutes.js     # Perfume endpoints
│   ├── memberRoutes.js      # Member endpoints
│   └── collectorRoutes.js   # Collector endpoints
├── utils/
│   └── generateToken.js     # JWT token generation
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── server.js               # Express app setup
├── seed.js                 # Database seeder
├── package.json            # Dependencies
└── README.md              # Documentation
```

## Next Steps

To complete the MERN stack application:

1. Create a React frontend
2. Implement UI for all features
3. Add OAuth2 authentication (optional)
4. Deploy to production (Heroku, Railway, etc.)
5. Add more features (wishlist, cart, orders, etc.)

## Support

For questions or issues, please refer to the assignment requirements or contact your instructor.
