const express = require('express');
const cors = require("cors");
require('./db')
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const cameraRoutes = require('./routes/devices');
const actionsRoutes = require('./routes/openai.js');
const generateRandomEmotion = require('./utils/utils_emotions.js')

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/cameras', cameraRoutes);
app.use('/actions', actionsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setTimeout(()=>{
 // generateRandomEmotion() ;

},5000)
module.exports=app;
