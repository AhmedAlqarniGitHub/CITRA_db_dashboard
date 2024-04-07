const userValidationSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['organizer', 'admin', 'attendee'] },
    description: { type: 'string' },
    avatarUrl: { type: 'string' },
  },
  required: ['name', 'email', 'role'],
  additionalProperties: true
};

  
const eventValidationSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    location: { type: 'string' },
    startingDate: { type: 'string', format: 'date-time' },
    endingDate: { type: 'string', format: 'date-time' },
    description: { type: 'string' },
    organizer: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }, // Assuming MongoDB ObjectId pattern
    status: { type: 'string' },
    cameras: {
      type: 'array',
      items: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' } // ObjectId pattern
    }
  },
  
  required: ['name', 'location', 'startingDate', 'endingDate', 'organizer', 'cameras'], // Include 'camera' as a required field
  additionalProperties: true
};

  
const cameraValidationSchema = {
  type: 'object',
  properties: {
    manufacturer: { type: 'string' },
    model: { type: 'string' },  // Ensure this is marked as required
    supportedQuality: { type: 'string' },
    framesPerSecond: { type: 'number' },
    status: { 
      type: 'string',
      enum: ['available', 'in-use', 'maintenance']  // Allowed values for status
    },
  },
  required: ['manufacturer', 'model', 'supportedQuality', 'framesPerSecond', 'status'],  // Include 'status' as a required field
  additionalProperties: true
};



  
  
  module.exports = {
    userValidationSchema,
    eventValidationSchema,
    cameraValidationSchema,
  };
  