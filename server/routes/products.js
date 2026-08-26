const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed initial products into database
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany([
      { title: "Wine Tailored Pantsuit", price: 4249.95, category: "formal", image: "w1.jpg" },
      { title: "Gold Bow-knot Earrings", price: 28.00, category: "jewelry", image: "w2.png" }
    ]);
    res.json({ message: "Database seeded successfully!", products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;