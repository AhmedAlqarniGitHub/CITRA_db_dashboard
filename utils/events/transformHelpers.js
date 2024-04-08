const Event = require("../../models/event");

function initializeEmotionCounts() {
  const emotions = [
    "happy",
    "sad",
    "neutral",
    "angry",
    "surprised",
    "disgusted",
    "fearful",
  ];
  let emotionCounts = {};
  emotions.forEach((emotion) => {
    emotionCounts[emotion] = 0;
  });
  return emotionCounts;
}

// Function to transform aggregated data into the required format
function transformCompleteEventData(aggregatedData) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let dataByMonth = {};

  aggregatedData.forEach((item) => {
    // Directly access month and eventName
    const month = item.month;
    const eventName = item.eventName;
    
    // Check if month is defined
    if (month === undefined) {
      console.error("Month is undefined for item:", item);
      return; // Skip this item if month is undefined
    }

    // Initialize month entry if not present
    if (!dataByMonth[month]) {
      dataByMonth[month] = { month: getMonthName(month) };
    }

    // Aggregate emotions for each event
    dataByMonth[month][eventName] = initializeEmotionCounts();
    dataByMonth[month][eventName] = Object.assign(dataByMonth[month][eventName], item.emotions.reduce((acc, emotion) => {
      acc[emotion.type] = emotion.count;
      return acc;
    }, {}))
  });

  return Object.values(dataByMonth);
}

function transformEventsBarChart(eventsBarChartAggregation) {
  return eventsBarChartAggregation.map((item) => {
    // Create a new object with the 'event' key
    const transformedItem = { event: item.event };

    // Loop over the remaining keys in the item
    Object.entries(item).forEach(([key, value]) => {
      if (key !== "event") {
        // Copy each emotion count to the new object, with proper capitalization
        transformedItem[key] = value;
      }
    });

    return transformedItem;
  });
}

function transformEventsTimeline(eventsTimelineAggregation) {
  let allEvents = eventsTimelineAggregation
    .map((item, index) => {
      const events = [];
      if (item.startTime) {
        events.push({
          id: (index * 2 + 1).toString(),
          title: `${item.title} Started`,
          status: "Started",
          time: item.startTime.toISOString(),
        });
      }
      if (item.endTime) {
        events.push({
          id: (index * 2 + 2).toString(),
          title: `${item.title} Ended`,
          status: "Ended",
          time: item.endTime.toISOString(),
        });
      }
      return events;
    })
    .flat();

  // Sorting allEvents by time in ascending order
  allEvents.sort((a, b) => new Date(a.time) - new Date(b.time));

  return allEvents;
}

function getMonthName(monthNumber) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1];
}

function transformHeatmapData(heatmapAggregation) {
  const categories = [
    "neutral",
    "fearful",
    "surprised",
    "disgusted",
    "sad",
    "happy",
    "angry",
  ];
  const series = heatmapAggregation.map((event) => {
    let data = categories.map((category) => {
      // Find the emotion in the event data, considering different capitalizations
      let emotion = event.emotions.find(
        (e) => e.emotion.toLowerCase() === category.toLowerCase()
      );
      return emotion ? emotion.count : 0;
    });

    return { name: event._id, data };
  });

  return {
    categories,
    series,
  };
}

async function transformForAppWebsiteVisits(aggregatedData, year) {
  let eventDataByMonthThisYear = {};
  let totalEmotionsThisYear = 0;
  let totalEmotionsLastYear = 0;

  // Aggregate total emotions count per month for this year
  aggregatedData.forEach((item) => {
    const month = item.month - 1; // Month index should be 0-based
    const eventName = item.eventName;

    if (!eventDataByMonthThisYear[eventName]) {
      eventDataByMonthThisYear[eventName] = new Array(12).fill(0); // Initialize array for 12 months
    }

    const totalEmotions = item.emotions.reduce((sum, emotionObj) => {
      return sum + emotionObj.count; // Ensure emotionObj.count is a number
    }, 0);

    eventDataByMonthThisYear[eventName][month] += totalEmotions;
    totalEmotionsThisYear += totalEmotions;
  });

  // Calculate total emotions for the previous year
  totalEmotionsLastYear = await getTotalEmotionsForYear(year - 1);

  // Calculate the percentage increase
  const percentageIncrease = calculatePercentageIncrease(
    totalEmotionsThisYear,
    totalEmotionsLastYear
  );

  // Create series for the chart
  const series = Object.entries(eventDataByMonthThisYear).map(
    ([name, data]) => ({
      name,
      type: "line", // or 'column', 'area' depending on your need
      fill: "solid", // or 'gradient'
      data,
    })
  );

  return {
    title: "Emotions per Event",
    subheader: `(${percentageIncrease}%) than last year`,
    chart: {
      labels: generateMonthlyLabels(year),
      series,
    },
  };
}

async function getTotalEmotionsForYear(year) {
  const result = await Event.aggregate([
    {
      $match: {
        startingDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    { $unwind: "$emotions" },
    { $group: { _id: null, total: { $sum: 1 } } },
  ]);

  return result.length > 0 ? result[0].total : 0;
}

function calculatePercentageIncrease(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return (((current - previous) / previous) * 100).toFixed(2);
}

function generateMonthlyLabels(year) {
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  return months.map((month) => `${month}/01/${year}`);
}

function transformEmotionsHeatmapData(emotionsHeatmapAggregation) {
  let heatmapData = {};

  emotionsHeatmapAggregation.forEach((item) => {
    const eventName = item.eventName;
    const month = item.month;
    const dayPeriod = item.dayPeriod;

    if (!heatmapData[eventName]) {
      heatmapData[eventName] = {};
    }

    if (!heatmapData[eventName][month]) {
      heatmapData[eventName][month] = Array.from({ length: 12 }, () =>
        initializeEmotionCounts()
      );
    }

    item.emotions.forEach((emotion) => {
      heatmapData[eventName][month][dayPeriod][emotion.emotion] = emotion.count;
    });
  });

  return heatmapData;
}




module.exports = {
  transformCompleteEventData,
  generateMonthlyLabels,
  calculatePercentageIncrease,
  getTotalEmotionsForYear,
  transformForAppWebsiteVisits,
  transformHeatmapData,
  transformEventsBarChart,
  transformEventsTimeline,
  transformEmotionsHeatmapData,
};
