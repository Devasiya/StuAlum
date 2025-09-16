// const mongoose = require('mongoose');
// const YourModel = require('./models/UserCareer.js');  // Adjust model name and path accordingly
// const sampleData = require('./init/UserCareer.js');  // Adjust path accordingly

// const mongoURI = "mongodb://127.0.0.1:27017/StudAlum";  // Replace with your actual MongoDB connection string

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('MongoDB connected successfully');
//   initializeData(); // Call initialization after connection
// })
// .catch((err) => console.error('MongoDB connection error:', err));

// async function initializeData() {
//   try {
//     const count = await YourModel.countDocuments();
//     if (count === 0) {
//       await YourModel.insertMany(sampleData);
//       console.log('Sample data initialized in MongoDB');
//     } else {
//       console.log('Sample data already present in MongoDB');
//     }
//   } catch (error) {
//     console.error('Error initializing sample data:', error);
//   }
// }
const express = require('express');

const cors = require('cors');

const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});