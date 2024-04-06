const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validateSchema = require("../validatorMiddleware");
const { userValidationSchema } = require("../validation/schemas");

// Register User
router.post(
  "/register",
  validateSchema(userValidationSchema),
  async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Info
router.get("/get-user/:userId", async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user._id; // Assuming user ID is stored in req.user
  try {
    const user = await User.findById(userId);
    if (
      !user ||
      (user._id.toString() !== requesterId && req.user.role !== "admin")
    ) {
      return res.status(404).json({ error: "User not found or access denied" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all users (Admin only)
router.get("/all", async (req, res) => {
  const requesterId = req.user._id; // Assuming user ID is stored in req.user
  try {
    const requestingUser = await User.findById(requesterId);
    if (requestingUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Info
router.patch(
  "/update/:userId",
  validateSchema(userValidationSchema),
  async (req, res) => {
    const { userId } = req.params;
    const requesterId = req.user._id; // Assuming user ID is stored in req.user
    try {
      const user = await User.findById(requesterId);
      if (userId !== requesterId && user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete a user (Admin only)
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user._id; // Assuming user ID is stored in req.user
  try {
    const requestingUser = await User.findById(requesterId);
    if (requestingUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
