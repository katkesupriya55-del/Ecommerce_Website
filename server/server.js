const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express App
const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files (HTML, CSS, JS, Images) from parent directory
app.use(express.static(path.join(__dirname, '../')));

// Import API Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Serve Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Ecommerce.html'));
});

// API Route Middlewares
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Handle 404 (Route Not Found)
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});