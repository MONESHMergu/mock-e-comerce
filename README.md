#  E-Commerce Platform

> A full-stack e-commerce application with MongoDB persistence, Fake Store API integration, and comprehensive error handling.
monesh mergu

## 🚀 Features

- ✅ **Product Catalog** - Real products from Fake Store API
- ✅ **Shopping Cart** - Add, update, and remove items
- ✅ **Checkout System** - Complete order processing with receipts
- ✅ **Order History** - View all past orders
- ✅ **MongoDB Persistence** - User data, cart items, and order history
- ✅ **Error Handling** - Comprehensive validation and error responses
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Framer Motion

**Backend:** Node.js, Express, MongoDB, Mongoose

## 📁 Project Structure

```
nexora/
├── backend/
│   ├── models.js           # MongoDB schemas
│   ├── server.js           # Express API server
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProductList.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── OrderConfirmation.jsx
    │   │   └── OrderHistory.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 📋 Prerequisites

- Node.js (v14 or later)
- npm
- MongoDB (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd nexora
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**Configure `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/nexora
PORT=4000
FAKE_STORE_API=https://fakestoreapi.com
NODE_ENV=development
```

**Start MongoDB** (if using local installation):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Start backend server:**
```bash
npm start
```
Server runs on `http://localhost:4000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## 📡 API Endpoints

- `GET /api/products` - Get all products
- `GET /api/cart?userId=email` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process checkout
- `GET /api/orders?userId=email` - Get user's order history
- `GET /api/image?url=<url>` - Proxy external images

## 📸 Screenshots

### Product Catalog
![Products](screenshots/product-list.png)

### Shopping Cart
![Cart](screenshots/cart.png)

### Checkout
![Checkout](screenshots/checkout.png)

### Order Confirmation
![Order Confirmation](screenshots/order-confirmation.png)

### Order History
![Orders](screenshots/order-history.png)

## 📖 Project Overview

Nexora is a modern full-stack e-commerce platform that demonstrates a complete online shopping experience. The application integrates with the Fake Store API to fetch real product data and uses MongoDB for persistent data storage.

### Key Highlights

**Frontend Architecture:**
- Built with React 18 and Vite for fast development and optimal performance
- Responsive UI using Tailwind CSS for mobile and desktop compatibility
- Framer Motion for smooth animations and transitions
- Client-side routing with React Router for seamless navigation
- Auto-refreshing cart that syncs with the database every 3 seconds

**Backend Architecture:**
- RESTful API built with Express.js
- MongoDB integration with Mongoose ODM for data modeling
- Automatic user creation and management based on email
- Error handling with graceful fallback to in-memory storage
- Image proxy to resolve CORS issues with external images
- Product caching (5 minutes) to reduce external API calls

**Database Schema:**
- **Users Collection:** Stores customer information (name, email, creation date)
- **Cart Items Collection:** Manages shopping cart data linked to users
- **Receipts Collection:** Persists order history with complete transaction details

### Application Flow

1. **Browse Products:** Users view products fetched from Fake Store API with real-time data
2. **Add to Cart:** Selected items are added to MongoDB-backed shopping cart
3. **Manage Cart:** Users can update quantities or remove items with instant database synchronization
4. **Checkout:** Complete purchase with customer information
5. **Order Confirmation:** Animated confirmation page displays order details and receipt ID
6. **Order History:** View all past orders with expandable item details

### Technical Features

**User Management:**
- Automatic user creation on first interaction
- Email-based user identification
- LocalStorage integration for session persistence
- User email displayed in navigation bar

**Cart Management:**
- Real-time synchronization with MongoDB
- Automatic refresh every 3 seconds when cart page is active
- Event-driven updates when items are added
- Quantity management with validation

**Order Processing:**
- Receipt generation with unique order IDs
- Complete order history tracking
- Customer information persistence
- Item-level order details with images and pricing

**Error Handling:**
- Comprehensive input validation on all endpoints
- Graceful degradation to in-memory storage if MongoDB fails
- Fallback product data if external API is unavailable
- Global error handler for unhandled exceptions

**Performance Optimizations:**
- Product response caching (5 minutes)
- Image proxy with 24-hour cache
- Lazy loading for images
- Optimized database queries

## 🔐 Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the backend directory:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/nexora

# Server port
PORT=4000

# External API endpoint
FAKE_STORE_API=https://fakestoreapi.com

# Environment mode
NODE_ENV=development
```

**MongoDB Options:**
- **Local:** `mongodb://localhost:27017/nexora`
- **Atlas:** `mongodb+srv://username:password@cluster.mongodb.net/nexora`

## 🎯 Usage Guide

### Adding Products to Cart
1. Browse the product catalog on the home page
2. Click "Add to Cart" on desired products
3. Items are immediately saved to MongoDB
4. Navigate to Cart page to view items

### Managing Cart
1. Click on the Cart icon in navigation
2. Use +/- buttons to adjust quantities
3. Click trash icon to remove items
4. Total updates automatically

### Completing Purchase
1. Click "Proceed to Checkout" from cart
2. Enter your name and email
3. Review order summary
4. Click "Place Order"
5. View animated confirmation page
6. Order is saved to database

### Viewing Order History
1. Click "Orders" in navigation
2. View all past orders
3. Click "Show Details" to expand order items
4. See order statistics at the bottom


