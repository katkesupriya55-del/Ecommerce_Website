const mongoose = require('mongoose');
const path = require('path');

// Explicitly load .env from the server directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');

const sampleProducts = [
  {
    title: 'Formal Silk Saree',
    price: 89.99,
    category: 'Formal Wears',
    image: 'https://via.placeholder.com/200'
  },
  {
    title: 'Traditional Gold Necklace',
    price: 149.99,
    category: 'Jewelry',
    image: 'https://via.placeholder.com/200'
  },
  {
    title: 'Leather Sandals',
    price: 39.99,
    category: 'Footwear',
    image: 'https://via.placeholder.com/200'
  }
];

async function seedDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from your .env file.');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection established.');

    console.log('Clearing old products...');
    await Product.deleteMany({});

    console.log('Inserting sample products...');
    await Product.insertMany(sampleProducts);

    console.log('Database successfully seeded with products!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();