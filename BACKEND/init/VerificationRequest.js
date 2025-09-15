const mongoose = require('mongoose');
const User = require('../models/User');               // User model
const College = require('../models/College');         // College model
const AdminProfile = require('../models/AdminProfile'); // Admin model
const VerificationRequest = require('../models/VerificationRequest'); // VerificationRequest model

async function seedVerificationRequests() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/StuAlum', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Fetch users, colleges, admins
    const users = await User.find().limit(10);
    const colleges = await College.find().limit(5);
    const admins = await AdminProfile.find().limit(2);

    if (users.length === 0 || colleges.length === 0) {
      console.log("Users or Colleges not found. Please insert them first.");
      return;
    }

    // Generate 10 sample verification requests
    const requests = users.map((user, index) => ({
      user_id: user._id,
      college_id: colleges[index % colleges.length]._id,
      role: index % 2 === 0 ? 'student' : 'alumni',
      documents: [`doc_${index + 1}_1.pdf`, `doc_${index + 1}_2.pdf`],
      status: index % 3 === 0 ? 'approved' : index % 3 === 1 ? 'rejected' : 'pending',
      remarks: index % 3 === 0 ? "Verified successfully" : index % 3 === 1 ? "Documents incomplete" : "",
      verified_by: index % 3 === 0 ? admins[0]._id : undefined,
      created_at: new Date(Date.now() - index * 86400000), // spread over 10 days
      verified_at: index % 3 === 0 ? new Date(Date.now() - (index-1) * 86400000) : undefined
    }));

    await VerificationRequest.insertMany(requests);
    console.log("10 VerificationRequest samples inserted successfully!");
    await mongoose.disconnect();

  } catch (err) {
    console.error("Error seeding VerificationRequest:", err);
  }
}

seedVerificationRequests();
