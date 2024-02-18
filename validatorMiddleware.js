const Ajv = require('ajv');
const ajv = new Ajv();

// Define custom email format
ajv.addFormat('email', {
    type: 'string',
    validate: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });

  // Define custom "date-time" format
ajv.addFormat('date-time', {
  type: 'string',
  validate: (dateTimeStr) => {
    // Simple regex for ISO 8601 dates, you can use a more precise regex or a library like `date-fns` or `moment.js` for thorough validation
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
    return iso8601Regex.test(dateTimeStr);
  }
});


// Define a custom "ipv4" format
ajv.addFormat('ipv4', {
  type: 'string',
  validate: (value) => {
    // Simple regex for IPv4 validation
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
  }
});


const validateSchema = (schema) => {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      return res.status(400).json({ errors: validate.errors });
    }
    next();
  };
};

module.exports = validateSchema;
