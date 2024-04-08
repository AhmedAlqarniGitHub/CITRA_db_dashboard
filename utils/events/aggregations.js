// aggregations.js
const Event = require("../../models/event");
const User = require("../../models/user");
const mongoose = require("mongoose");

// Utility function to create a match query
const createMatchQuery = async (year, organizerId) => {
  const match = await createMatchQueryForSummary(organizerId);
  match.startingDate = {
    $gte: new Date(`${year}-01-01`),
    $lte: new Date(`${year}-12-31`),
  };
  return match;
};

const getCompleteEventDataAggregation = async (year, organizerId = null) => {
  const matchQuery = await createMatchQuery(year, organizerId);
  const completeEventDataAggregation = await Event.aggregate([
    { $match: matchQuery },
    { $unwind: "$emotions" },
    {
      $group: {
        _id: {
          month: {
            $month: {
              $cond: {
                if: { $eq: [{ $type: "$emotions.detectionTime" }, "date"] },
                then: "$emotions.detectionTime",
                else: {
                  $dateFromString: {
                    dateString: "$emotions.detectionTime",
                  },
                },
              },
            },
          },
          eventName: "$name",
          emotion: "$emotions.detectedEmotion",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          month: "$_id.month",
          eventName: "$_id.eventName",
        },
        emotions: {
          $push: {
            type: "$_id.emotion",
            count: "$count",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        eventName: "$_id.eventName",
        emotions: 1,
      },
    },
  ]);
  return completeEventDataAggregation;
};

const getEventsBarChartAggregation = async (year, organizerId = null) => {
  const matchQuery = await createMatchQuery(year, organizerId);
  const eventsBarChartAggregation = await Event.aggregate([
    { $match: matchQuery },
    { $unwind: "$emotions" },
    {
      $group: {
        _id: {
          eventName: "$name",
          emotion: "$emotions.detectedEmotion",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.eventName",
        emotions: {
          $push: {
            k: "$_id.emotion",
            v: "$count",
          },
        },
      },
    },
    {
      $project: {
        event: "$_id",
        emotions: { $arrayToObject: "$emotions" },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $mergeObjects: [{ event: "$event" }, "$emotions"] },
      },
    },
  ]);
  return eventsBarChartAggregation;
};

const getEventsTimelineAggregation = async (year, organizerId = null) => {
  const matchQuery = await createMatchQuery(year, organizerId);
  const eventsTimelineAggregation = await Event.aggregate([
    { $match: matchQuery },

    {
      $project: {
        title: "$name",
        startTime: "$startingDate",
        endTime: "$endingDate",
      },
    },
  ]);

  return eventsTimelineAggregation;
};

const getTotalEmotionsPerEventAggregation = async (
  year,
  organizerId = null
) => {
  const matchQuery = await createMatchQuery(year, organizerId);
  const totalEmotionsPerEventAggregation = await Event.aggregate([
    { $match: matchQuery },
    { $unwind: "$emotions" },
    {
      $group: {
        _id: "$name",
        totalEmotions: { $sum: 1 },
      },
    },
    {
      $project: {
        label: "$_id",
        value: "$totalEmotions",
        _id: 0,
      },
    },
  ]);
  return totalEmotionsPerEventAggregation;
};

const getHeatmapAggregation = async (year, organizerId = null) => {
  const matchQuery = await createMatchQuery(year, organizerId);
  const heatmapAggregation = await Event.aggregate([
    { $match: matchQuery },
    { $unwind: "$emotions" },
    {
      $group: {
        _id: {
          eventName: "$name",
          emotion: "$emotions.detectedEmotion",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.eventName",
        emotions: {
          $push: {
            emotion: "$_id.emotion",
            count: "$count",
          },
        },
      },
    },
  ]);
  return heatmapAggregation;
};

// Utility function to create a match query
const createMatchQueryForSummary = async (organizerId) => {
  const match = {};
  try {
    if (organizerId) {
      const user = await User.findById(organizerId);
      if (user.role == "admin") {
        return {};
      } else {
        match.organizer = new mongoose.Types.ObjectId(organizerId);
      }
    }
  } catch (err) {}

  console.log(match);
  return match;
};

// Aggregation for Event Summary
async function getEventSummaryAggregation(organizerId = null) {
  const matchQuery = await createMatchQueryForSummary(organizerId);
  console.log("matchQuery", matchQuery);
  const totalEvents = await Event.countDocuments(matchQuery);
  const activeEvents = await Event.countDocuments({
    ...matchQuery,
    status: "active",
  });

  const totalEmotions = await Event.aggregate([
    { $match: matchQuery },
    { $unwind: "$emotions" },
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0, count: 1 } },
  ]);

  console.log(totalEmotions);

  const emotionsCount = totalEmotions.length > 0 ? totalEmotions[0].count : 0;
  return { totalEvents, activeEvents, totalEmotions: emotionsCount };
}

const getEmotionsHeatmapAggregation = async (year, organizerId = null) => {
  const matchQuery = await createMatchQuery(year, organizerId);
  const emotionsHeatmapAggregation = await Event.aggregate([
    { $match: matchQuery },
    { $unwind: "$emotions" },
    {
      $group: {
        _id: {
          month: { $month: "$emotions.detectionTime" },
          eventName: "$name",
          dayPeriod: {
            $floor: {
              $divide: [{ $hour: "$emotions.detectionTime" }, 2],
            },
          },
          emotion: "$emotions.detectedEmotion",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          month: "$_id.month",
          eventName: "$_id.eventName",
          dayPeriod: "$_id.dayPeriod",
        },
        emotions: {
          $push: {
            emotion: "$_id.emotion",
            count: "$count",
          },
        },
      },
    },
    {
      $project: {
        month: "$_id.month",
        eventName: "$_id.eventName",
        dayPeriod: "$_id.dayPeriod",
        emotions: 1,
        _id: 0,
      },
    },
  ]);
  return emotionsHeatmapAggregation;
};



module.exports = {
  getCompleteEventDataAggregation,
  getEventsBarChartAggregation,
  getEventsTimelineAggregation,
  getTotalEmotionsPerEventAggregation,
  getHeatmapAggregation,
  createMatchQueryForSummary,
  getEventSummaryAggregation,
  getEmotionsHeatmapAggregation,
};
