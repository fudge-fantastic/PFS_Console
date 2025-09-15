# 🚀 PixelForge Backend API Guide

> **Version:** 1.0.0  
> **Base URL:** `http://localhost:8000`  
> **Documentation:** `http://localhost:8000/docs` (Swagger UI)  
> **Alternative Docs:** `http://localhost:8000/redoc`

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [User Management](#user-management)
   - [Category Management](#category-management)
   - [Product Management](#product-management)
   - [Inquiry System](#inquiry-system)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [File Upload Guidelines](#file-upload-guidelines)
7. [Rate Limiting & Security](#rate-limiting--security)
8. [Testing](#testing)

---

## 🌟 Overview

The PixelForge Backend API is a RESTful service built with FastAPI for managing an e-commerce platform specializing in custom magnets and photo products. The API provides secure user authentication, product management, file uploads, and customer inquiry handling.

### Key Features
- 🔐 JWT-based authentication with role-based access control
- 👥 User management (Admin/Customer roles)
- 🛍️ Product catalog management with image uploads
- 📧 Customer inquiry system with email notifications
- 🖼️ Multi-image upload support (up to 5 images per product)
- 🔒 Product locking mechanism for inventory control

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid Bearer token.

### Authentication Flow
1. Register or login to obtain a JWT token
2. Include the token in the `Authorization` header for protected requests
3. Token expires after 30 minutes (configurable)

### Header Format
```
Authorization: Bearer your-jwt-token-here
```

### User Roles
- **USER**: Regular customers (view products, submit inquiries)
- **ADMIN**: Administrators (full product management, user management)

---

## 🛣️ API Endpoints

### 🔑 Authentication Endpoints

#### Register User
```http
POST /auth/register
```

Create a new user account and receive an authentication token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

**Validation Rules:**
- Email must be valid format
- Password minimum 8 characters
- Email must be unique

---

#### Login User
```http
POST /auth/login
```

Authenticate existing user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

---

#### OAuth2 Token Endpoint
```http
POST /auth/token
```

OAuth2-compatible token endpoint for authentication.

**Request Body (Form Data):**
```
username: user@example.com
password: securePassword123
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 👥 User Management

#### Get Current User Profile
```http
GET /users/me
```

Retrieve the current authenticated user's profile information.

**Authentication:** Required (USER or ADMIN)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### List All Users (Admin Only)
```http
GET /users/?skip=0&limit=100
```

Retrieve paginated list of all users in the system.

**Authentication:** Required (ADMIN only)

**Query Parameters:**
- `skip` (int, optional): Number of records to skip (default: 0)
- `limit` (int, optional): Maximum records to return (default: 100, max: 1000)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 10 users successfully",
  "data": [
    {
      "id": 1,
      "email": "user1@example.com",
      "role": "USER",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 50
}
```

---

#### Get User by ID (Admin Only)
```http
GET /users/{user_id}
```

Retrieve specific user details by user ID.

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `user_id` (int): User ID to retrieve

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "data": {
    "id": 5,
    "email": "specific@example.com",
    "role": "USER",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### 🏷️ Category Management

#### Create Category (Admin Only)
```http
POST /categories/
```

Create a new product category.

**Authentication:** Required (ADMIN only)

**Request Body:**
```json
{
  "name": "Custom Magnets",
  "description": "Custom personalized magnets for special occasions"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Custom Magnets",
    "description": "Custom personalized magnets for special occasions",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

**Validation Rules:**
- `name`: Required, max 100 characters, must be unique
- `description`: Optional, max 500 characters

---

#### List All Categories
```http
GET /categories/?skip=0&limit=100&active_only=false
```

Retrieve paginated list of all categories with optional filtering.

**Authentication:** Not required (Public endpoint)

**Query Parameters:**
- `skip` (int, optional): Records to skip (default: 0)
- `limit` (int, optional): Max records (default: 100, max: 1000)
- `active_only` (bool, optional): Show only active categories (default: false)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 3 categories successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Photo Magnets",
      "description": "Custom photo magnets for memories",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Fridge Magnets",
      "description": "Decorative fridge magnets",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 3
}
```

---

#### List Active Categories Only
```http
GET /categories/active?skip=0&limit=100
```

Retrieve only active categories (public endpoint for customer-facing interfaces).

**Authentication:** Not required (Public endpoint)

**Query Parameters:**
- `skip` (int, optional): Records to skip (default: 0)
- `limit` (int, optional): Max records (default: 100, max: 1000)

**Use Case:** Customer-facing category selection

**Response:** Same format as "List All Categories" but only active categories

---

#### Get Single Category
```http
GET /categories/{category_id}
```

Retrieve detailed information for a specific category.

**Authentication:** Not required (Public endpoint)

**Path Parameters:**
- `category_id` (string): Category ObjectId

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category details retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Photo Magnets",
    "description": "Custom photo magnets for memories",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### Update Category (Admin Only)
```http
PUT /categories/{category_id}
```

Update an existing category. All fields are optional.

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `category_id` (string): Category ObjectId to update

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "is_active": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Category Name",
    "description": "Updated description",
    "is_active": false,
    "updated_at": "2025-01-15T11:45:00Z"
  }
}
```

---

#### Delete Category (Admin Only)
```http
DELETE /categories/{category_id}?hard_delete=false
```

Delete a category. By default performs soft delete (deactivation).

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `category_id` (string): Category ObjectId to delete

**Query Parameters:**
- `hard_delete` (bool, optional): Permanently delete category (default: false)

**Soft Delete Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deactivated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "deleted": false
  }
}
```

**Hard Delete Response (200 OK):**
```json
{
  "success": true,
  "message": "Category permanently deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "deleted": true
  }
}
```

**Important Notes:**
- Soft delete deactivates the category (sets `is_active` to false)
- Hard delete permanently removes the category from database
- Categories with associated products should be handled carefully
- Use soft delete for preserving data integrity

---

### 🛍️ Product Management

#### Create Product (Admin Only)
```http
POST /products/
```

Create a new product with images.

**Authentication:** Required (ADMIN only)

**Request Body (Multipart Form Data):**
```
title: "Beautiful Photo Magnet" (required, max 150 chars)
description: "Detailed product description" (optional, max 1000 chars)
short_description: "Brief description" (optional, max 50 chars)
price: 299.99 (required, > 0)
category_id: "507f1f77bcf86cd799439011" (required, valid ObjectId)
rating: 4.5 (optional, 0.0-5.0, default: 0.0)
images: [file1.jpg, file2.png] (optional, max 5 files)
```

**Note:** `category_id` must be a valid ObjectId of an existing category. Use the category endpoints to get available category IDs.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Beautiful Photo Magnet",
    "description": "Detailed product description",
    "short_description": "Brief description",
    "price": 299.99,
    "category_id": "507f1f77bcf86cd799439011",
    "category_name": "Photo Magnets",
    "rating": 4.5,
    "images": ["/uploads/products/uuid-image1.jpg"],
    "is_locked": false,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### List All Products
```http
GET /products/?skip=0&limit=100&category_id=507f1f77bcf86cd799439011
```

Retrieve paginated list of all products with optional category filtering.

**Authentication:** Not required (Public endpoint)

**Query Parameters:**
- `skip` (int, optional): Records to skip (default: 0)
- `limit` (int, optional): Max records (default: 100, max: 1000)
- `category_id` (string, optional): Filter by category ObjectId

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 15 products successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Beautiful Photo Magnet",
      "description": "Detailed product description",
      "short_description": "Brief description",
      "price": 299.99,
      "category_id": "507f1f77bcf86cd799439011",
      "category_name": "Photo Magnets",
      "rating": 4.5,
      "images": ["/uploads/products/uuid-image1.jpg"],
      "is_locked": false,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 45
}
```

---

#### List Unlocked Products Only
```http
GET /products/unlocked?skip=0&limit=100&category_id=507f1f77bcf86cd799439011
```

Retrieve only products that are unlocked (available for purchase).

**Authentication:** Not required (Public endpoint)

**Query Parameters:**
- `skip` (int, optional): Records to skip (default: 0)
- `limit` (int, optional): Max records (default: 100, max: 1000)
- `category_id` (string, optional): Filter by category ObjectId

**Use Case:** Customer-facing product catalog

**Response:** Same format as "List All Products"

---

#### Get Single Product
```http
GET /products/{product_id}
```

Retrieve detailed information for a specific product.

**Authentication:** Not required (Public endpoint)

**Path Parameters:**
- `product_id` (string): Product ObjectId

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product details retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Beautiful Photo Magnet",
    "description": "Detailed product description",
    "short_description": "Brief description",
    "price": 299.99,
    "category_id": "507f1f77bcf86cd799439011",
    "category_name": "Photo Magnets",
    "rating": 4.5,
    "images": [
      "/uploads/products/uuid-image1.jpg",
      "/uploads/products/uuid-image2.jpg"
    ],
    "is_locked": false,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### Update Product (Admin Only)
```http
PUT /products/{product_id}
```

Update an existing product. All fields are optional.

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `product_id` (string): Product ObjectId to update

**Request Body (Multipart Form Data):**
```
title: "Updated Title" (optional, max 150 chars)
description: "Updated description" (optional, max 1000 chars)
short_description: "Updated brief description" (optional, max 50 chars)
price: 399.99 (optional, > 0)
category_id: "507f1f77bcf86cd799439012" (optional, valid ObjectId)
rating: 4.8 (optional, 0.0-5.0)
images: [new_file1.jpg] (optional, replaces all existing images)
```

**Note:** If new images are provided, all existing images are replaced.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Updated Title",
    "description": "Updated description",
    "short_description": "Updated brief description",
    "price": 399.99,
    "category_id": "507f1f77bcf86cd799439012",
    "category_name": "Fridge Magnets",
    "rating": 4.8,
    "images": ["/uploads/products/new-uuid-image1.jpg"],
    "is_locked": false,
    "updated_at": "2025-01-15T11:45:00Z"
  }
}
```

---

#### Delete Product (Admin Only)
```http
DELETE /products/{product_id}
```

Permanently delete a product and its associated images.

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `product_id` (string): Product ObjectId to delete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013"
  }
}
```

---

#### Lock Product (Admin Only)
```http
PATCH /products/{product_id}/lock
```

Lock a product to prevent modifications and hide from customer catalog.

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `product_id` (string): Product ObjectId to lock

**Use Cases:**
- Temporarily remove from sale
- Prevent accidental modifications
- Inventory management

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product locked successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Beautiful Photo Magnet",
    "is_locked": true
  }
}
```

---

#### Unlock Product (Admin Only)
```http
PATCH /products/{product_id}/unlock
```

Unlock a product to allow modifications and show in customer catalog.

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `product_id` (string): Product ObjectId to unlock

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product unlocked successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Beautiful Photo Magnet",
    "is_locked": false
  }
}
```

---

### 📧 Inquiry System

#### Submit Customer Inquiry
```http
POST /inquiry/contact
```

Submit a customer inquiry/contact form. Automatically sends notification emails.

**Authentication:** Not required (Public endpoint)

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1-555-123-4567",
  "subject": "Custom Magnet Order",
  "message": "I would like to order custom photo magnets for my wedding. Can you provide pricing for bulk orders?",
  "subscribe_newsletter": true
}
```

**Field Validation:**
- `first_name`, `last_name`: Required, max 50 chars, cannot be empty
- `email`: Required, valid email format
- `phone_number`: Optional, min 10 digits when provided
- `subject`: Required, max 100 chars, cannot be empty
- `message`: Required, max 1000 chars, min 10 chars
- `subscribe_newsletter`: Optional boolean

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Thank you for your inquiry! We have received your message and will get back to you soon.",
  "data": {
    "reference_id": "INQ-20250115-1234",
    "submitted_at": "2025-01-15T10:30:00Z",
    "status": "received"
  }
}
```

**Email Notifications:**
- Admin receives inquiry notification
- Customer receives confirmation email
- Emails sent asynchronously (non-blocking)

---

#### Test Email Service
```http
GET /inquiry/contact/test
```

Test endpoint to verify email service configuration.

**Authentication:** Not required (Testing endpoint)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email service is working correctly!",
  "data": {
    "test_completed": true,
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

---

## 📊 Data Models

### User Model
```json
{
  "id": "507f1f77bcf86cd799439010",
  "email": "user@example.com",
  "role": "USER", // "USER" | "ADMIN"
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### Category Model
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Photo Magnets",
  "description": "Custom photo magnets for memories",
  "is_active": true,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### Product Model
```json
{
  "id": "507f1f77bcf86cd799439013",
  "title": "Beautiful Photo Magnet",
  "description": "Detailed product description",
  "short_description": "Brief description",
  "price": 299.99,
  "category_id": "507f1f77bcf86cd799439011", // Reference to Category ObjectId
  "category_name": "Photo Magnets", // Populated category name (read-only)
  "rating": 4.5, // 0.0 to 5.0
  "images": [
    "/uploads/products/uuid-image1.jpg",
    "/uploads/products/uuid-image2.jpg"
  ],
  "is_locked": false,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### Inquiry Model
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1-555-123-4567",
  "subject": "Custom Order Request",
  "message": "I need custom magnets...",
  "subscribe_newsletter": true
}
```

### Standard API Response
```json
{
  "success": true, // boolean
  "message": "Operation completed successfully", // string
  "data": {} // object | array | null
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Retrieved X items successfully",
  "data": [], // array of items
  "total": 100 // total count for pagination
}
```

---

## ⚠️ Error Handling

The API uses standard HTTP status codes and returns consistent error responses.

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Response Format
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Error Scenarios

#### Authentication Errors
```json
// 401 Unauthorized
{
  "detail": "Could not validate credentials"
}

// 401 Unauthorized (Login)
{
  "detail": "Incorrect email or password"
}
```

#### Validation Errors
```json
// 422 Validation Error
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

#### Business Logic Errors
```json
// 400 Bad Request
{
  "detail": "Email already registered"
}

// 400 Bad Request
{
  "detail": "Maximum 5 images allowed per product"
}

// 404 Not Found
{
  "detail": "Product not found"
}
```

---

## 📁 File Upload Guidelines

### Supported Image Formats
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **WebP** (.webp)

### Upload Limits
- **Maximum file size:** 5MB per image
- **Maximum images per product:** 5 files
- **File naming:** Auto-generated UUIDs to prevent conflicts

### Upload Process
1. Files are validated for type and size
2. Images are saved to `uploads/products/` directory
3. Filenames are generated using UUIDs
4. File paths are stored in database
5. Images are accessible via `/uploads/products/filename.ext`

### Example Upload URL
```
http://localhost:8000/uploads/products/3bd65763-891a-4dcf-bdad-9752f007d85e.png
```

---

## 🛡️ Rate Limiting & Security

### Security Features
- **JWT Authentication** with configurable expiration
- **Role-based Access Control** (RBAC)
- **Input Validation** using Pydantic models
- **CORS Protection** (configurable origins)
- **File Upload Security** (type and size restrictions)
- **SQL Injection Protection** via SQLAlchemy ORM
- **Password Hashing** using secure algorithms

### Best Practices
1. Always use HTTPS in production
2. Set specific CORS origins (not `*`)
3. Use strong JWT secret keys
4. Implement rate limiting for public endpoints
5. Regular security updates
6. Monitor file upload directories
7. Validate all user inputs

---

## 🧪 Testing

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "upload_service": "active"
}
```

### Root Endpoint
```http
GET /
```

**Response:**
```json
{
  "message": "Welcome to PixelForge Backend",
  "version": "1.0.0",
  "status": "active",
  "docs": "/docs",
  "redoc": "/redoc"
}
```

### Interactive Documentation
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Example cURL Commands

#### Register User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Login User
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Get Products
```bash
curl -X GET "http://localhost:8000/products/"
```

#### Create Category (Admin)
```bash
curl -X POST "http://localhost:8000/categories/" \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Custom Magnets","description":"Custom personalized magnets"}'
```

#### List Categories
```bash
curl -X GET "http://localhost:8000/categories/?active_only=true"
```

#### Create Product (Admin)
```bash
curl -X POST "http://localhost:8000/products/" \
  -H "Authorization: Bearer your-admin-token" \
  -F "title=Test Product" \
  -F "description=A test product description" \
  -F "price=99.99" \
  -F "category_id=507f1f77bcf86cd799439011" \
  -F "images=@image1.jpg"
```

#### Submit Inquiry
```bash
curl -X POST "http://localhost:8000/inquiry/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"John",
    "last_name":"Doe",
    "email":"john@example.com",
    "subject":"Test Inquiry",
    "message":"This is a test inquiry message"
  }'
```

---

## 📚 Additional Resources

### Configuration
The API behavior can be customized via environment variables or `.env` file:

```env
# Database
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=pixelforge_db

# JWT
SECRET_KEY=your-super-secret-jwt-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# SMTP
SMTP_SERVER=smtp.office365.com
SMTP_USERNAME=support@pixelforgestudio.in
SMTP_PASSWORD=your-email-password
ADMIN_EMAIL=admin@pixelforgestudio.in

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Development Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Set up environment variables
3. Initialize MongoDB database: `python scripts/init_db.py`
4. Seed dummy data (optional): `python scripts/seed_dummy_data.py`
5. Run server: `python run.py` or `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
6. Access documentation: `http://localhost:8000/docs`

### Production Deployment
- Use environment-specific configuration
- Enable HTTPS
- Set up proper CORS origins
- Configure production MongoDB database with authentication
- Set up proper logging
- Implement monitoring and alerts

---

## 📞 Support

For technical support or questions about this API:
- **Email:** support@pixelforgestudio.in
- **Documentation:** Available at `/docs` endpoint
- **GitHub:** Repository issues and discussions

---

**Last Updated:** September 4, 2025  
**API Version:** 1.0.0
