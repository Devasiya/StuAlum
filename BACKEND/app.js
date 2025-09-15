const mongoose = require('mongoose');
const YourModel = require('./models/UserCareer.js');  // Adjust model name and path accordingly
const sampleData = require('./init/UserCareer.js');  // Adjust path accordingly

const mongoURI = "mongodb://127.0.0.1:27017/StudAlum";  // Replace with your actual MongoDB connection string

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  initializeData(); // Call initialization after connection
})
.catch((err) => console.error('MongoDB connection error:', err));

async function initializeData() {
  try {
    const count = await YourModel.countDocuments();
    if (count === 0) {
      await YourModel.insertMany(sampleData);
      console.log('Sample data initialized in MongoDB');
    } else {
      console.log('Sample data already present in MongoDB');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}
