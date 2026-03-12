const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Protected route example
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

module.exports = router;