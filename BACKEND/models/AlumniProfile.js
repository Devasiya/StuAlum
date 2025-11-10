const mongoose = require('mongoose');
const { createEmbedding } = require("../utils/aiService.js");

const AlumniProfileSchema = new mongoose.Schema({
  college_id: { type: String, ref: 'College', required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  graduation_year: { type: Number, required: true },
  degree: { type: String },
  //specialization: { type: String },
  //enrollment_number: { type: String },
  current_position: { type: String },
  company: { type: String },
  industry: { type: String },
  location: { type: String },
  professional_achievements: { type: String },
  skills: { type: [String], default: [] },
  linkedin_url: { type: String },
  github_url: { type: String },
  leetcode_url: { type: String },
  contribution_preferences: { type: [String] },
  about_me: { type: String },
  profile_photo_url: { type: String },
  contact_number: { type: String },
  verificationFile: { type: String },
  is_verified: { type: Boolean, default: false },
  years_of_experience: { type: Number },
  preferred_communication: { type: [String], default: [] },
  engagement_status: { type: String, enum: ['active', 'inactive', 'recently_connected'], default: 'inactive' },
  prospect_type: { type: String, enum: ['mentor', 'donor', 'speaker'] },
  embedding: { type: [Number], default: [] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });



// On CREATE or SAVE
AlumniProfileSchema.pre("save", async function (next) {
  if (!this.isModified("skills") && !this.isModified("company") &&
      !this.isModified("industry") && !this.isModified("about_me") &&
      this.embedding?.length)
    return next();

  try {
    console.log(`🧠 Generating embedding for alumni: ${this.full_name}`);
    this.embedding = await createEmbedding(buildAlumniText(this));
  } catch (err) {
    console.error("❌ Alumni embedding failed:", err.message);
  }
  next();
});

// On UPDATE
AlumniProfileSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const updatedFields = this.getUpdate()?.$set || {};
  const changed = ["skills", "company", "industry", "about_me"]
    .some(f => f in updatedFields);
  if (changed) {
    console.log(`🧠 Re-embedding updated alumni: ${doc.full_name}`);
    doc.embedding = await createEmbedding(buildAlumniText(doc));
    await doc.save();
  }
});
//ai ke liye

module.exports = mongoose.model('AlumniProfile', AlumniProfileSchema);
