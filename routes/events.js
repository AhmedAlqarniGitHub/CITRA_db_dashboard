const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const validateSchema = require("../validatorMiddleware");
const { eventValidationSchema } = require("../validation/schemas");
const {
  getCompleteEventDataAggregation,
  getEventsBarChartAggregation,
  getEventsTimelineAggregation,
  getTotalEmotionsPerEventAggregation,
  getHeatmapAggregation,
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
      res.status(400).json({ error: error.message });
    }
  }
);

// Update Event
router.patch(
  "/update/:eventId",
  validateSchema(eventValidationSchema),
  async (req, res) => {
    const { eventId } = req.params;
    try {
      const event = await Event.findByIdAndUpdate(eventId, req.body, {
        new: true,
      });
      res.status(200).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

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
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

  try {
    

    const completeEventDataAggregation = await getCompleteEventDataAggregation(year);
    const eventsBarChartAggregation = await getEventsBarChartAggregation(year);
    const eventsTimelineAggregation = await getEventsTimelineAggregation(year);
    const totalEmotionsPerEventAggregation = await getTotalEmotionsPerEventAggregation(year);
    const heatmapAggregation = await getHeatmapAggregation(year);

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

// Aggregation for Event Summary
async function getEventSummaryAggregation() {
  const totalEvents = await Event.countDocuments();
  const activeEvents = await Event.countDocuments({ status: 'active' });

  // Assuming each event document has an 'emotions' array
  const totalEmotions = await Event.aggregate([
    { $unwind: "$emotions" },
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0, count: 1 } }
  ]);

  const emotionsCount = totalEmotions.length > 0 ? totalEmotions[0].count : 0;

  return {
    totalEvents,
    activeEvents,
    totalEmotions: emotionsCount
  };
}

// Add a new route for Event Summary
router.get("/summary", async (req, res) => {
  try {
    const summaryData = await getEventSummaryAggregation();
    res.status(200).json(summaryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
