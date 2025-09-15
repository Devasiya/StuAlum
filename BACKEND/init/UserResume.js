const mongoose = require('mongoose');
const User = require('../models/User');       // your User model
const UserResume = require('../models/UserResume'); // your UserResume model

async function seedUserResumes() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/StuAlum', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Fetch 10 users from the database
    const users = await User.find().limit(10);
    if (users.length === 0) {
      console.log("No users found in the database. Please insert users first.");
      return;
    }

    // Map user IDs
    const userIds = users.map(u => u._id);

    // Create 10 sample resumes
    const resumes = userIds.map((id, index) => ({
      user_id: id,
      file_data: Buffer.from(`Sample resume content for user ${index + 1}`), // dummy PDF data
      file_name: `resume_user_${index + 1}.pdf`,
      file_type: 'application/pdf',
      upload_date: new Date(),
      status: 'uploaded',
      review_summary: index % 2 === 0 ? "Good" : "Needs improvement",
      review_details: { comment: `Review details for user ${index + 1}` },
      reviewed_at: index % 2 === 0 ? new Date() : null
    }));

    // Insert into database
    await UserResume.insertMany(resumes);
    console.log("UserResume sample data inserted successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding UserResume:", error);
  }
}

seedUserResumes();
