const mongoose = require('mongoose');


// Replace 'yourDatabaseName' with the actual name of your local MongoDB database
//const DB_CONNECTION_STRING = 'mongodb://localhost:27017/citra';
const DB_CONNECTION_STRING='mongodb+srv://ahmedalg4321:citra321@cluster0.u2aiu58.mongodb.net/citra?retryWrites=true&w=majority'


mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...')

)
.catch((err) => console.error('MongoDB connection error:', err));
