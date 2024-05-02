const express = require("express");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
require("./db");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const cameraRoutes = require("./routes/devices");
const actionsRoutes = require("./routes/openai.js");
const generateRandomEmotion = require("./utils/utils_emotions.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(morgan("tiny"));

// Routes
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/cameras", cameraRoutes);
app.use("/actions", actionsRoutes);

// Create HTTP server (No need for HTTPS configuration)
const server = http.createServer(app);

// Starting the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Emotion generator, if needed
setTimeout(() => {
  // generateRandomEmotion();
}, 5000);

module.exports = app;
