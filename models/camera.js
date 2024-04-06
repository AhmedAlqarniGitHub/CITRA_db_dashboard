const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    supportedQuality: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      // Add this if it's needed
      type: String,
      required: true,
      trim: true,
    },
    framesPerSecond: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "in-use", "maintenance"],
    },
    // Additional camera-specific fields can be added here
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Camera = mongoose.model('Camera', cameraSchema);
module.exports = Camera;
