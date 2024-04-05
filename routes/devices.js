const express = require('express');
const router = express.Router();
const Camera = require('../models/camera');
const validateSchema = require('../validatorMiddleware');
const { cameraValidationSchema } = require('../validation/schemas');

router.post('/add', validateSchema(cameraValidationSchema), async (req, res) => {
  console.log(req.body);  // Log incoming data
  try {
    const camera = new Camera(req.body);
    await camera.save();
    res.status(201).json({ message: 'Camera added successfully', camera });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove Camera
router.delete('/remove/:cameraId', async (req, res) => {
  const { cameraId } = req.params;
  try {
    const camera = await Camera.findByIdAndDelete(cameraId);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.status(200).json({ message: 'Camera removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Camera
router.patch('/update/:cameraId', validateSchema(cameraValidationSchema), async (req, res) => {
  const { cameraId } = req.params;
  try {
    const camera = await Camera.findByIdAndUpdate(cameraId, req.body, { new: true });
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.status(200).json({ message: 'Camera updated successfully', camera });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// In your camera router
router.get('/all', async (req, res) => {
  try {
    const cameras = await Camera.find({});
    res.status(200).json(cameras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new route for Camera Summary
router.get("/summary", async (req, res) => {
  try {
    const totalCameras = await Camera.countDocuments();
    res.status(200).json({ totalCameras });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
