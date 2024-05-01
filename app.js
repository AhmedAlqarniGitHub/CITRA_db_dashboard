const express = require('express');
const cors = require("cors");
const https = require('https');
const fs = require('fs');
require('./db');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const cameraRoutes = require('./routes/devices');
const actionsRoutes = require('./routes/openai.js');
const generateRandomEmotion = require('./utils/utils_emotions.js');

const app = express();
const PORT = process.env.PORT || 3000;

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('certs/server.key'),
  cert: fs.readFileSync('certs/server.cert')
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/cameras', cameraRoutes);
app.use('/actions', actionsRoutes);

// Create HTTPS server
const server = https.createServer(httpsOptions, app);

// Starting the server
server.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});

setTimeout(() => {
  // generateRandomEmotion();
}, 5000);

module.exports = app;
