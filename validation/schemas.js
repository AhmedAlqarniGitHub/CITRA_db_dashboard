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
  additionalProperties: false
};

  
const eventValidationSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    location: { type: 'string' },
    startingDate: { type: 'string', format: 'date-time' },
    endingDate: { type: 'string', format: 'date-time' },
    description: { type: 'string' },
    organizer: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },// Assuming MongoDB ObjectId pattern
    status:{ type: 'string' }
  },
  required: ['name', 'location', 'startingDate', 'endingDate', 'organizer'],
  additionalProperties: false
};
  
const cameraValidationSchema = {
  type: 'object',
  properties: {
    manufacturer: { type: 'string' },
    model: { type: 'string' },  // Ensure this is marked as required
    supportedQuality: { type: 'string' },
    framesPerSecond: { type: 'number' },
  },
  required: ['manufacturer', 'model', 'supportedQuality', 'framesPerSecond'],
  additionalProperties: false
};


  
  
  module.exports = {
    userValidationSchema,
    eventValidationSchema,
    cameraValidationSchema,
  };
  