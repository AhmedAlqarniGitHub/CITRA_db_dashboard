const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const User = require("../models/user");
const validateSchema = require("../validatorMiddleware");
const { eventValidationSchema } = require("../validation/schemas");
const {
  getCompleteEventDataAggregation,
  getEventsBarChartAggregation,
  getEventsTimelineAggregation,
  getTotalEmotionsPerEventAggregation,
  getHeatmapAggregation,
  getEventSummaryAggregation,
} = require("../utils/events/aggregations");

const {
  transformCompleteEventData,
  generateMonthlyLabels,
  calculatePercentageIncrease,
  getTotalEmotionsForYear,
  transformForAppWebsiteVisits,
  transformHeatmapData,
  transformEventsBarChart,
  transformEventsTimeline,
} = require("../utils/events/transformHelpers");

// Helper function to check if user is an organizer of the event
async function isOrganizer(userId, eventId) {
  const event = await Event.findById(eventId);
  return event && event.organizer.equals(userId);
}

// Register Event
router.post(
  "/register",
  validateSchema(eventValidationSchema),
  async (req, res) => {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).json({ message: "Event registered successfully", event });
    } catch (error) {
      console.log("dfsdfdsf", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// Update Event (role-based access control added)
router.patch(
  "/update/:eventId",
  validateSchema(eventValidationSchema),
  async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user._id; // Assuming user ID is stored in req.user
    try {
      const user = await User.findById(userId);
      if (user.role !== 'admin' && !(await isOrganizer(userId, eventId))) {
        return res.status(403).json({ message: "Access denied" });
      }
      const event = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
      res.status(200).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete Event (role-based access control added)
router.delete("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id; // Assuming user ID is stored in req.user
  try {
    const user = await User.findById(userId);
    if (user.role !== 'admin' && !(await isOrganizer(userId, eventId))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record Detected Emotions
router.post("/emotions/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { emotions } = req.body; // Assume emotions is an array of emotion objects
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    event.emotions.push(...emotions);
    await event.save();
    res.status(200).json({ message: "Emotions recorded successfully", event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all events (role-based access control added)
router.get("/all", async (req, res) => {
  const userId = req.user._id; // Assuming user ID is stored in req.user
  try {
    const user = await User.findById(userId);
    const query = user.role === 'admin' ? {} : { organizer: userId };
    const events = await Event.find(query);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/emotions", async (req, res) => {
  const { eventId, cameraId, detectionTime, detectedEmotion } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.emotions.push({ camera: cameraId, detectionTime, detectedEmotion });
    await event.save();
    res.status(200).json({ message: "Emotion added successfully", event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Full Aggregation Endpoint
router.get("/charts", async (req, res) => {
  const year = new Date().getFullYear(); // Adjust as needed
  const userId = req.user._id; // Assuming user ID is stored in req.user

  try {
    const user = await User.findById(userId);
    const matchQuery = user && user.role === "admin" ? {} : { organizer: userId };

    // Pass matchQuery to aggregation functions
    const completeEventDataAggregation = await getCompleteEventDataAggregation(
      year,
      matchQuery
    );
    const eventsBarChartAggregation = await getEventsBarChartAggregation(
      year,
      matchQuery
    );
    const eventsTimelineAggregation = await getEventsTimelineAggregation(
      year,
      matchQuery
    );
    const totalEmotionsPerEventAggregation =
      await getTotalEmotionsPerEventAggregation(year, matchQuery);
    const heatmapAggregation = await getHeatmapAggregation(year, matchQuery);

    const completeEventData = transformCompleteEventData(
      completeEventDataAggregation
    );
    const eventsBarChart = transformEventsBarChart(eventsBarChartAggregation);
    const eventsTimeline = transformEventsTimeline(eventsTimelineAggregation);
    const totalEmotionsPerEvent = totalEmotionsPerEventAggregation;
    const heatmapData = transformHeatmapData(heatmapAggregation);
    const appWebsiteVisitsData = await transformForAppWebsiteVisits(
      completeEventDataAggregation,
      year
    );

    res.json({
      completeEventData,
      eventsBarChart,
      eventsTimeline,
      totalEmotionsPerEvent,
      heatmapData,
      appWebsiteVisitsData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add a new route for Event Summary
router.get("/summary", async (req, res) => {
  try {
    // Obtain organizerId from request, e.g., from JWT token or request parameters
    const organizerId = req.organizerId; // Modify this line as per your implementation
    const summaryData = await getEventSummaryAggregation(organizerId);
    res.status(200).json(summaryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get satisfaction percentage for all events
router.get("/satisfaction", async (req, res) => {
  try {
    const organizerId = req.organizerId; // Modify this line as per your implementation
    const matchQuery = createMatchQueryForSummary(organizerId);
    const events = await Event.find(matchQuery).populate("emotions");

    const satisfactionData = events.map((event) => {
      let totalScore = 0;
      let maxScore = 0;

      event.emotions.forEach((emotion) => {
        // Assign scores to emotions
        let defaultFlag = false;
        switch (emotion.detectedEmotion.toLowerCase()) {
          case "happy":
            totalScore += 6;
            break;
          case "surprised":
            totalScore += 5;
            break;
          case "neutral":
            totalScore += 4;
            break;
          case "disgusted":
            totalScore += 3;
            break;
          case "fearful":
            totalScore += 2;
            break;
          case "sad":
            totalScore += 1;
            break;
          case "angry":
            totalScore += 0;
            break;
          default:
            defaultFlag = true;
        }
        if (!defaultFlag) maxScore += 6;
        // Assuming the highest score an emotion can get is 2
      });

      // Calculate the satisfaction percentage
      let satisfactionPercentage = 0;
      if (maxScore > 0) {
        satisfactionPercentage = (totalScore / maxScore) * 100;
      }

      return {
        eventId: event._id,
        eventName: event.name,
        satisfaction: satisfactionPercentage.toFixed(2), // Round to two decimal places
      };
    });

    res.status(200).json(satisfactionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
