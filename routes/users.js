const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validateSchema = require('../validatorMiddleware');
const { userValidationSchema } = require('../validation/schemas');

// Register User
router.post('/register', validateSchema(userValidationSchema), async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Generate and return token (implementation depends on chosen strategy, e.g., JWT)
    res.status(200).json({ message: 'Login successful', user }); // Simplified for brevity
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update User Info
router.patch('/update/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Info
router.get('/get-user/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
