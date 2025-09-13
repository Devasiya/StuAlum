const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin'], required: true },
  is_verified: { type: Boolean, default: false },
  profile_status: { type: String, default: 'incomplete' }, // or 'complete'
  auth_provider: { type: String, enum: ['google', 'linkedin', 'local'], default: 'local' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', UserSchema);
