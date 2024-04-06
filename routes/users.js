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
      req.body.password = "citra2024";
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.log("register: ", error)
      res.status(400).json({ error: error.message });
    }
  }
);

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password )
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Generate and return token (implementation depends on chosen strategy, e.g., JWT)
    res.status(200).json({ message: "Login successful", "info":{"name":user.name,"id":user.id,"role":user.role,"email":user.email, "avatarUrl":user.avatarUrl} }); // Simplified for brevity
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Info
router.get("/get-user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user || (user._id.toString() !== userId && user.role !== "admin")) {
      return res.status(404).json({ error: "User not found or access denied" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all users (Admin only)
router.get("/all/:userId", async (req, res) => {
  const {userId} = req.params; // Assuming user ID is stored in req.user
  try {
    const requestingUser = await User.findById(userId);
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
  "/update/:updatedUserId/:userId",
  validateSchema(userValidationSchema),
  async (req, res) => {
    const { updatedUserId, userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (userId !== updatedUserId && user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        updatedUserId,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("user update error: ", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete a user (Admin only)
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const requestingUser = await User.findById(userId);
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
