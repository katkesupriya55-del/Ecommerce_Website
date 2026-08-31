const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  items: [
    {
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

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