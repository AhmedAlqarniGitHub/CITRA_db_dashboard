const express = require("express");
const router = express.Router();
const Camera = require("../models/camera");
const Event = require("../models/event");
const User = require("../models/user");
const validateSchema = require("../validatorMiddleware");
const { cameraValidationSchema } = require("../validation/schemas");
const mongoose = require("mongoose");
// Helper function to get camera IDs for a given organizer
async function getCamerasForOrganizer(organizerId) {
  const organizerIdObject = new mongoose.Types.ObjectId(organizerId);
  const events = await Event.find({ organizer: organizerIdObject }).select(
    "cameras"
  );
  const cameraIds = events.flatMap((event) => event.cameras);
  return [...new Set(cameraIds)]; // Return unique camera IDs
}

// Add Camera
router.post(
  "/add",
 validateSchema(cameraValidationSchema),
  async (req, res) => {
    try {
      const userId = req.body.id; // Assuming user ID is stored in req.user
      const user = await User.findById(userId);

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const camera = new Camera(req.body);
      await camera.save();
      res.status(201).json({ message: "Camera added successfully", camera });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Remove Camera (Admin only)
router.delete("/remove/:cameraId/:userId", async (req, res) => {
  const { cameraId, userId } = req.params;
  const user = await User.findById(userId);

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const camera = await Camera.findByIdAndDelete(cameraId);
    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }
    res.status(200).json({ message: "Camera removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Camera (Admin only)
router.patch("/update/:cameraId/:userId", validateSchema(cameraValidationSchema), async (req, res) => {
  const { cameraId, userId } = req.params;
  const user = await User.findById(userId);

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const updateData = { ...req.body };
  
  // Explicitly check if eventId should be unset
  if (updateData.eventId === 'none' || updateData.eventId === '') {
    updateData.eventId = null; // Set eventId to null to remove it
  }


  try {
    const camera = await Camera.findByIdAndUpdate(cameraId, updateData, { new: true, omitUndefined: true });
    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }
    res.status(200).json({ message: "Camera updated successfully", camera });
  } catch (error) {
    console.log("Error: " + error);
    res.status(400).json({ error: error.message });
  }
});




// Get All Cameras with Event Name
router.get("/all/:userId", async (req, res) => {
  const { userId } = req.params; // Assuming user ID is stored in req.user
  try {
    const user = await User.findById(userId);
    let matchCondition = {};

    // Adjust match condition based on user role
    if (user.role === "admin") {
      // Admins get all cameras
      matchCondition = {};
    } else if (user.role === "organizer") {
      // Organizers get their cameras
      const cameraIds = await getCamerasForOrganizer(userId);
      matchCondition = { _id: { $in: cameraIds.map(id => new mongoose.Types.ObjectId(id)) } };
    } else {
      // Non-organizers and non-admins have no access
      return res.status(403).json({ message: "Access Denied" });
    }

    const cameras = await Camera.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: "events", // This should be the name of your events collection in MongoDB
          localField: "eventId",
          foreignField: "_id",
          as: "eventDetails"
        }
      },
      {
        $unwind: {
          path: "$eventDetails",
          preserveNullAndEmptyArrays: true // Keep cameras that don't have an associated event
        }
      },
      {
        $project: {
          manufacturer: 1,
          model: 1,
          supportedQuality: 1,
          framesPerSecond: 1,
          status: 1,
          eventId: 1,
          eventName: "$eventDetails.name" // Include event name in the result
        }
      }
    ]);

    res.status(200).json(cameras);
  } catch (error) {
    console.log("Error fetching cameras:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// Get Available Cameras
router.get("/available/:userId", async (req, res) => {
  const { userId } = req.params; // Assuming user ID is stored in req.user
  try {
    const user = await User.findById(userId);
    let cameras;

    if (user.role === "admin") {
      cameras = await Camera.find({ status: "available" });
    } else if (user.role === "organizer") {
      const cameraIds = await getCamerasForOrganizer(userId);
      cameras = await Camera.find({
        _id: { $in: cameraIds },
        status: "available",
      });
    } else {
      cameras = []; // Non-organizers and non-admins have no access
    }

    res.status(200).json(cameras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Camera Summary
router.get("/summary/:userId", async (req, res) => {
  const { userId } = req.params; // Assuming user ID is stored in req.user
  try {
    const user = await User.findById(userId);
    let totalCameras;

    if (user.role === "admin") {
      totalCameras = await Camera.countDocuments();
    } else if (user.role === "organizer") {
      const cameraIds = await getCamerasForOrganizer(userId);
      totalCameras = await Camera.countDocuments({ _id: { $in: cameraIds } });
    } else {
      totalCameras = 0; // Non-organizers and non-admins have no access
    }

    res.status(200).json({ totalCameras });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
