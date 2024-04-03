// aggregations.js
const Event = require("../../models/event");

const getCompleteEventDataAggregation = async (year) => {
  const completeEventDataAggregation = await Event.aggregate([
    {
      $match: {
        startingDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
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

const getEventsBarChartAggregation = async (year) => {
  // Aggregation for eventsBarChart with dynamic emotions
  const eventsBarChartAggregation = await Event.aggregate([
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

const getEventsTimelineAggregation = async (year) => {
  // Aggregation for eventsTimeline
  const eventsTimelineAggregation = await Event.aggregate([
    {
      $match: {
        $or: [
          {
            startingDate: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
          {
            endingDate: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        ],
      },
    },
    {
      $project: {
        title: "$name",
        startTime: "$startingDate",
        endTime: "$endingDate",
      },
    },
  ]);

  return eventsTimelineAggregation;
}

const getTotalEmotionsPerEventAggregation = async (year) => {

    const totalEmotionsPerEventAggregation = await Event.aggregate([
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
}

const getHeatmapAggregation = async (year) => {
  // Aggregation for heatmap data
  const heatmapAggregation = await Event.aggregate([
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


module.exports = {
  getCompleteEventDataAggregation,
  getEventsBarChartAggregation,
  getEventsTimelineAggregation,
  getTotalEmotionsPerEventAggregation,
  getHeatmapAggregation,
};
