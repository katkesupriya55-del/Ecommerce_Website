const express = require('express');
const router = express.Router();

// Defined relative to /api/auth
router.post('/register', (req, res) => {
  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login successful' });
});

module.exports = router;