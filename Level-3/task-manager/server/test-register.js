const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// Simple User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Simple pre-save hook
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model('TestUser', userSchema);

// Test register endpoint
app.post('/test-register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User exists' });
    }

    // Create and save user
    const user = new User({ name, email, password });
    await user.save();

    res.json({ 
      message: 'Success!', 
      user: { id: user._id, name, email } 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5001, () => {
      console.log('Test server running on port 5001');
    });
  })
  .catch(err => {
    console.error('MongoDB error:', err);
  });