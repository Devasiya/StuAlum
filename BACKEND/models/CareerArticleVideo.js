// BACKEND/models/CareerArticleVideo.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CareerArticleVideoSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true,
        maxlength: 150
    },
    // Source of the content (e.g., 'Alumni Insights', 'Video')
    source_type: { 
        type: String, 
        required: true,
        enum: ['Alumni Insights', 'Video', 'Blog Post']
    },
    // Reading/Watching time (e.g., '5 min read', '8 min')
    duration_text: {
        type: String,
        required: true 
    },
    // Link to the external or hosted content
    content_url: {
        type: String,
        required: true 
    },
    // Topic for filtering (e.g., Interviewing, Resume, Networking)
    topic: {
        type: String,
        required: true
    },
    // Who added/manages the content (Admin)
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminProfile', 
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('CareerArticleVideo', CareerArticleVideoSchema);