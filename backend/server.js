require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const { User, CartItem, Receipt } = require('./models');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB Connection with fallback
let isMongoConnected = false;
let inMemoryData = {
  users: new Map(),
  cart: [],
  receipts: []
};

if (process.env.MONGODB_URI && process.env.MONGODB_URI !== '') {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    isMongoConnected = true;
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Falling back to in-memory storage');
    isMongoConnected = false;
  });
} else {
  console.log('No MongoDB URI provided. Using in-memory storage.');
  isMongoConnected = false;
}

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// In-memory user management (fallback)
const getOrCreateUserMemory = (name, email) => {
  if (!inMemoryData.users.has(email)) {
    inMemoryData.users.set(email, {
      _id: Date.now().toString(),
      name,
      email,
      createdAt: new Date()
    });
  }
  return inMemoryData.users.get(email);
};

// Create or get user (with MongoDB fallback)
const getOrCreateUser = async (name, email) => {
  try {
    if (!isMongoConnected) {
      return getOrCreateUserMemory(name, email);
    }
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }
    return user;
  } catch (error) {
    console.error('User operation failed, using fallback:', error.message);
    return getOrCreateUserMemory(name, email);
  }
};

// Fetch products from Fake Store API
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchFakeStoreProducts = async () => {
  try {
    const response = await axios.get(`${process.env.FAKE_STORE_API}/products`, {
      timeout: 10000
    });
    
    // Transform Fake Store API products to match our format
    return response.data.map(product => ({
      id: product.id,
      name: product.title,
      price: Math.round(product.price * 83.5 * 100), // Convert to paise (INR)
      image: product.image,
      category: product.category,
      description: product.description
    }));
  } catch (error) {
    console.error('Fake Store API error:', error.message);
    // Return fallback products if API fails
    return [
      { id: 1, name: 'Wireless Headphones', price: 6639, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop&q=80' },
      { id: 2, name: 'Smartphone', price: 49799, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop&q=80' },
      { id: 3, name: 'Laptop', price: 107899, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop&q=80' },
      { id: 4, name: 'Gaming Mouse', price: 4149, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=400&fit=crop&q=80' },
      { id: 5, name: 'Keyboard', price: 7469, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=400&fit=crop&q=80' },
      { id: 6, name: 'Monitor', price: 24899, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=400&fit=crop&q=80' },
      { id: 7, name: 'Webcam', price: 5809, image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&h=400&fit=crop&q=80' },
      { id: 8, name: 'USB Hub', price: 2074, image: 'https://images.unsplash.com/photo-1625328342415-d7fbca4f74c5?w=500&h=400&fit=crop&q=80' }
    ];
  }
};

// GET /api/products - Return all products from Fake Store API
app.get('/api/products', asyncHandler(async (req, res) => {
  // Check cache
  const now = Date.now();
  if (cachedProducts && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    return res.json(cachedProducts);
  }

  // Fetch fresh data
  const products = await fetchFakeStoreProducts();
  cachedProducts = products;
  cacheTimestamp = now;
  
  res.json(products);
}));

// POST /api/cart - Add or update item in cart
app.post('/api/cart', asyncHandler(async (req, res) => {
  const { productId, qty, userId = 'mock@user.com' } = req.body;
  
  if (!productId || !qty || qty <= 0) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  // Get products to validate
  const products = cachedProducts || await fetchFakeStoreProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Get or create mock user
  const user = await getOrCreateUser('Mock User', userId);

  if (!isMongoConnected) {
    // In-memory fallback
    const existingItem = inMemoryData.cart.find(item => 
      item.userId === user._id && item.productId === productId
    );
    
    if (existingItem) {
      existingItem.qty = qty;
      existingItem.price = product.price;
    } else {
      inMemoryData.cart.push({
        _id: Date.now().toString(),
        userId: user._id,
        productId,
        name: product.name,
        price: product.price,
        qty,
        image: product.image,
        createdAt: new Date()
      });
    }
    return res.json({ message: 'Item added to cart (in-memory)' });
  }

  // MongoDB storage
  let cartItem = await CartItem.findOne({ userId: user._id, productId });
  
  if (cartItem) {
    cartItem.qty = qty;
    cartItem.price = product.price;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      userId: user._id,
      productId,
      name: product.name,
      price: product.price,
      qty,
      image: product.image
    });
  }

  res.json({ message: 'Item added to cart', cartItem });
}));

// GET /api/cart - Return cart items and total
app.get('/api/cart', asyncHandler(async (req, res) => {
  const { userId = 'mock@user.com' } = req.query;
  
  if (!isMongoConnected) {
    // In-memory fallback
    const user = getOrCreateUserMemory('Mock User', userId);
    const items = inMemoryData.cart.filter(item => item.userId === user._id);
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return res.json({ items, total });
  }
  
  const user = await User.findOne({ email: userId });
  if (!user) {
    return res.json({ items: [], total: 0 });
  }

  const items = await CartItem.find({ userId: user._id });
  const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  res.json({ items, total });
}));

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', asyncHandler(async (req, res) => {
  const itemId = req.params.id;
  
  if (!isMongoConnected) {
    // In-memory fallback
    const index = inMemoryData.cart.findIndex(item => item._id === itemId);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    inMemoryData.cart.splice(index, 1);
    return res.json({ message: 'Item removed from cart (in-memory)' });
  }
  
  const cartItem = await CartItem.findByIdAndDelete(itemId);
  
  if (!cartItem) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Item removed from cart' });
}));

// POST /api/checkout - Process checkout
app.post('/api/checkout', asyncHandler(async (req, res) => {
  const { cartItems, name, email } = req.body;
  
  if (!cartItems || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Get or create user
  const user = await getOrCreateUser(name, email);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const receiptId = 'RCP' + Date.now();
  const timestamp = new Date();

  const receiptData = {
    receiptId,
    userId: user._id,
    timestamp,
    total,
    customerName: name,
    customerEmail: email,
    items: cartItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image
    }))
  };

  if (!isMongoConnected) {
    // In-memory fallback
    inMemoryData.receipts.push(receiptData);
    inMemoryData.cart = inMemoryData.cart.filter(item => item.userId !== user._id);
    return res.json({ receiptId, timestamp: timestamp.toISOString(), total });
  }

  // MongoDB storage
  await Receipt.create(receiptData);
  
  // Clear cart after checkout
  await CartItem.deleteMany({ userId: user._id });

  res.json({ receiptId, timestamp: timestamp.toISOString(), total });
}));

// GET /api/orders - Get all orders for a user
app.get('/api/orders', asyncHandler(async (req, res) => {
  const { userId = 'mock@user.com' } = req.query;
  
  if (!isMongoConnected) {
    // In-memory fallback
    const user = inMemoryData.users.get(userId);
    if (!user) {
      return res.json([]);
    }
    const userOrders = inMemoryData.receipts
      .filter(receipt => receipt.userId === user._id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.json(userOrders);
  }
  
  const user = await User.findOne({ email: userId });
  if (!user) {
    return res.json([]);
  }

  const orders = await Receipt.find({ userId: user._id })
    .sort({ timestamp: -1 }); // Most recent first
  
  res.json(orders);
}));

// GET /api/orders/:receiptId - Get specific order details
app.get('/api/orders/:receiptId', asyncHandler(async (req, res) => {
  const { receiptId } = req.params;
  
  if (!isMongoConnected) {
    // In-memory fallback
    const order = inMemoryData.receipts.find(r => r.receiptId === receiptId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(order);
  }
  
  const order = await Receipt.findOne({ receiptId });
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
}));

// Proxy external images to avoid ORB/CORS issues
app.get('/api/image', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing url query parameter');
  }
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(response.data);
  } catch (err) {
    console.error('Image proxy error:', err.message);
    res.status(500).send('Image proxy error');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});