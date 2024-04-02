const Event = require('../models/event'); // Adjust path as needed
const Camera = require('../models/camera'); // Adjust path as needed

 async function generateRandomEmotion() {
  try {
    // Retrieve all active events
    const activeEvents = await Event.find({ status: 'active' });
    // Retrieve all camera IDs
    const cameras = await Camera.find({});
    const cameraIds = cameras.map(camera => camera._id);
console.log("activeEvents:: ",activeEvents)
    activeEvents.forEach(async (event) => {
      const emotions = [];
      for (let i = 0; i < 100; i++) {
        const emotionTypes = ['happy', 'sad', 'neutral', 'angry', 'surprised', 'disgusted', 'fearful'];
        const detectedEmotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
        const detectionTime = new Date(+event.startingDate + Math.random() * (event.endingDate - event.startingDate));
        const cameraId = cameraIds[Math.floor(Math.random() * cameraIds.length)];

        emotions.push({
          detectedEmotion,
          detectionTime,
          camera: cameraId
        });
      }

      // Add emotions to the event
      event.emotions.push(...emotions);
      await event.save();
    });

    console.log('Random emotions generated and saved to events successfully.');
  } catch (error) {
    console.error('Error generating random emotions:', error);
  }
}

//generateRandomEmotion();
module.exports = generateRandomEmotion;
