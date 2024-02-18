const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
  detectedEmotion: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'neutral', 'angry', 'surprised', 'disgusted', 'fearful']
  },
  detectionTime: {
    type: Date,
    required: true
  }
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  startingDate: {
    type: Date,
    required: true
  },
  endingDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotions: [emotionSchema],
  cameras: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera'
  }]
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
