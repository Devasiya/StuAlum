const mongoose = require('mongoose');
require('dotenv').config();

// Require models to register them
require('./models/User');
require('./models/AlumniProfile');
require('./models/StudentProfile');
require('./models/AdminProfile');
const Message = require('./models/Message');
const AlumniProfile = require('./models/AlumniProfile');
const StudentProfile = require('./models/StudentProfile');
const AdminProfile = require('./models/AdminProfile');

async function checkMessages() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/StudAlum';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const messages = await Message.find({}).limit(5);
    console.log('Sample messages:');
    for (const msg of messages) {
      console.log('Message ID:', msg._id);
      console.log('Sender ID (string):', msg.sender_id ? msg.sender_id.toString() : null);
      console.log('Sender Email:', msg.sender_email);
      console.log('Sender Name:', msg.sender_name);
      console.log('Message text:', msg.message_text);

      // Check profile models
      if (msg.sender_id) {
        let profile = await AlumniProfile.findById(msg.sender_id);
        if (profile) {
          console.log('Found in AlumniProfile:', profile.full_name, profile.email);
        } else {
          profile = await StudentProfile.findById(msg.sender_id);
          if (profile) {
            console.log('Found in StudentProfile:', profile.full_name, profile.email);
          } else {
            profile = await AdminProfile.findById(msg.sender_id);
            if (profile) {
              console.log('Found in AdminProfile:', profile.full_name, profile.email);
            } else {
              console.log('NOT FOUND in any profile model!');
            }
          }
        }
      }
      console.log('---');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkMessages();
