const express = require('express');
require('./db')
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const cameraRoutes = require('./routes/devices');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/cameras', cameraRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports=app;
