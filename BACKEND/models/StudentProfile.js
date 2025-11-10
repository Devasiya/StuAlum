const mongoose = require('mongoose');
const { createEmbedding } = require("../utils/aiService.js");


const StudentProfileSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  enrollment_number: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, required: true },
  year_of_admission: { type: Number, required: true },
  year_of_graduation: { type: Number, required: true },
  contact_number: { type: String },
  address: { type: String },
  skills: [String],
  interests: [String],
  career_goals: { type: String },
  discovery_insights: { type: String },
  preferences: { type: String },
  photo: { type: String },
  profile_photo_url: { type: String },
  current_position: { type: String },
  company: { type: String },
  verificationFile: { type: String },
  linkedin: { type: String },
  github: { type: String },
  extracurricular: { type: String },
  is_verified: { type: Boolean, default: false },
  notifications: {
    mentorship: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    community: { type: Boolean, default: false },
    content: { type: Boolean, default: true },
  },
  mentorship_area: { type: String },
  mentor_type: { type: String },
  communication: [String],
  hear_about: { type: String },
  projects: [Object],
  // Gamification fields
  points: { type: Number, default: 0 },
  badges: [
    {
      name: String,
      icon: String,
      description: String,
      dateEarned: { type: Date, default: Date.now },
    },
  ],
  //end part of gamification
  embedding: { type: [Number], default: [] },
}, 

{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// ✅ Generate embedding for new or modified students
StudentProfileSchema.pre("save", async function (next) {
  if (
    !this.isModified("skills") &&
    !this.isModified("career_goals") &&
    !this.isModified("mentorship_area") &&
    this.embedding.length
  ) {
    return next();
  }

  const text = `
    Name: ${this.full_name}
    Branch: ${this.branch}
    Skills: ${(this.skills || []).join(", ")}
    Career Goal: ${this.career_goals}
    Mentorship Area: ${this.mentorship_area}
  `;

  console.log(`🧠 Generating embedding for student: ${this.full_name}`);
  try {
    this.embedding = await createEmbedding(text);
  } catch (err) {
    console.error("❌ Failed to generate student embedding:", err);
  }
  next();
});

// ✅ Re-generate embedding after updates
StudentProfileSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const updatedFields = this.getUpdate()?.$set || {};
  const changed = ["skills", "career_goals", "mentorship_area"].some(f => f in updatedFields);

  if (changed) {
    console.log(`🧠 Re-embedding updated student: ${doc.full_name}`);
    doc.embedding = await createEmbedding(`
      Name: ${doc.full_name}
      Branch: ${doc.branch}
      Skills: ${(doc.skills || []).join(", ")}
      Career Goal: ${doc.career_goals}
      Mentorship Area: ${doc.mentorship_area}
    `);
    await doc.save();
  }
});

//end


module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
