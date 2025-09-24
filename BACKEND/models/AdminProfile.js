const mongoose = require('mongoose');

const AdminProfileSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  designation: { type: String },
  department: { type: String },
  contact_office: String,
  admin_level: { type: String, enum: ['super-admin', 'admin'], default: 'admin' },
  permissions: {
    edit_user: { type: Boolean, default: false },
    manage_events: { type: Boolean, default: false },
  },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('AdminProfile', AdminProfileSchema);
