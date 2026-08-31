const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders - Fetch all placed orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { customerName, shippingAddress, items, totalAmount } = req.body;

    const newOrder = new Order({
      customerName,
      shippingAddress,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;