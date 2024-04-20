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
    eventId: {  // Add this field to link a camera with an event
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',  // Reference to the Event model
      default: null 
       }
    // Additional camera-specific fields can be added here
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Camera = mongoose.model('Camera', cameraSchema);
module.exports = Camera;
