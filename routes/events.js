const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const validateSchema = require('../validatorMiddleware');
const { eventValidationSchema } = require('../validation/schemas');

// Register Event
router.post('/register', validateSchema(eventValidationSchema), async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: 'Event registered successfully', event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Event
router.patch('/update/:eventId', validateSchema(eventValidationSchema), async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Record Detected Emotions
router.post('/emotions/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { emotions } = req.body; // Assume emotions is an array of emotion objects
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    event.emotions.push(...emotions);
    await event.save();
    res.status(200).json({ message: 'Emotions recorded successfully', event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
