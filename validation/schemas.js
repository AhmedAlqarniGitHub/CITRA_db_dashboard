const userValidationSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['organizer', 'admin', 'attendee'] },
    password: { type: 'string' },
    description: { type: 'string' },
    age: { type: 'number', minimum: 0 }
  },
  required: ['name', 'email', 'role', 'password'],
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
    organizer: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' } // Assuming MongoDB ObjectId pattern
  },
  required: ['name', 'location', 'startingDate', 'endingDate', 'organizer'],
  additionalProperties: false
};
  
const cameraValidationSchema = {
  type: 'object',
  properties: {
    manufacturer: { type: 'string' },
    name: { type: 'string' },  // Add this if 'name' is a valid property
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
  