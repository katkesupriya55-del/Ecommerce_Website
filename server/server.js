const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Base Route
app.get('/', (req, res) => {
  res.send('Shop Easy API Server Active');
});

// Database Connection & Server Startup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopeasy';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));