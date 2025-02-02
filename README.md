# Art Gallery API Documentation

## Overview
This Art Gallery API enables users to register, authenticate, manage profiles, create and view artworks, categorize art, and handle orders efficiently. The API supports role-based access control for Artists, Customers, and Admins.

## Base URL
```
http://localhost:8080/api
```

## Authentication
Use JWT tokens for authorization. Include the token in the `Authorization` header as follows:
```
Authorization: Bearer your.jwt.token
```

## Endpoints

### 1. **Authentication Endpoints**
- **User Registration:** `POST /users/register`
- **Login:** `POST /auth/login`

### 2. **User Profile Endpoints**
- **Get Profile:** `GET /users/profile`
- **Update Profile:** `PUT /users/profile`
- **Upload Profile Image:** `POST /users/profile/image`
- **Get Profile Image:** `GET /users/profile/image`

### 3. **Artist Endpoints**
- **Get All Artists:** `GET /artists`
- **Get Specific Artist:** `GET /artists/{id}`
- **Update Artist Profile:** `PUT /artists/{id}`
- **Get Artist's Artworks:** `GET /artists/{id}/artworks`

### 4. **Artwork Endpoints**
- **Create Artwork:** `POST /artworks?artistId={artistId}`
- **Get All Artworks:** `GET /artworks`
- **Get Specific Artwork:** `GET /artworks/{id}`
- **Filter by Status:** `GET /artworks/status/{status}`
- **Search Artworks:** `GET /artworks/search`

### 5. **Image Handling Endpoints**
- **Upload Artwork Image:** `POST /artworks/{id}/image`
- **Get Artwork Image:** `GET /artworks/{id}/image`

### 6. **Category Management Endpoints**
- **Get All Categories:** `GET /categories`
- **Create Category (Admin Only):** `POST /categories`
- **Get Category Details with Artworks:** `GET /categories/{id}/artworks`

### 7. **Artwork Categorization Endpoints**
- **Update Artwork Categories:** `PUT /artworks/{id}/categories`
- **Update Artwork Tags:** `PUT /artworks/{id}/tags`
- **Advanced Search:** `GET /artworks/advanced-search`

### 8. **Order Management Endpoints**
- **Create Order:** `POST /orders`
- **View All Orders (Admin Only):** `GET /orders`
- **View Specific Order:** `GET /orders/{id}`
- **Update Order Status:** `PUT /orders/{id}/status`
- **View My Orders:** `GET /orders/my-orders`
- **View My Sales (Artists Only):** `GET /orders/my-sales`

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Frontend Implementation

### 1. **Project Structure** (Completed)
- Implemented with Next.js 14
- Organized routing, components, services, and store

### 2. **Redux Setup** (Completed)
- Configured store using `@reduxjs/toolkit`
- Authentication slice with states and actions

### 3. **Authentication System** (Completed)
- Token management, role-based access control
- Custom hooks: `useAuth`, `useRoleGuard`

### 4. **Components** (Completed)
- Dashboard, Gallery, and Order Management Components
- Real-time data handling with loading skeletons

### 5. **Features**
- Category filtering with real-time updates
- Role-based dashboards
- Order status transitions with validations

## Technologies Used
- **Backend:** Spring Boot
- **Frontend:** Next.js, React, Redux Toolkit
- **Database:** MySQL
- **Authentication:** JWT

## Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/art-gallery.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the server:**
   ```bash
   npm run dev
   ```

## Contribution Guidelines
- Fork the repository
- Create a new branch: `git checkout -b feature-xyz`
- Make your changes and commit: `git commit -m 'Add feature xyz'`
- Push to your fork: `git push origin feature-xyz`
- Create a pull request
