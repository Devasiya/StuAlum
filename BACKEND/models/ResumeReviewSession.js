// BACKEND/models/ResumeReviewSession.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResumeReviewSessionSchema = new Schema({
    // --- User Identification ---
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'user_model_type'
    },
    user_model_type: {
        type: String,
        required: true,
        enum: ['StudentProfile', 'AlumniProfile'] // Only Students/Alumni use the AI tool
    },

    // --- Resume/File Details ---
    resume_path: {
        type: String,
        required: true, // Path where Multer saved the file
        trim: true
    },
    original_filename: {
        type: String
    },

    // --- Session Status ---
    status: {
        type: String,
        enum: ['Started', 'Processing', 'Ready', 'Closed'],
        default: 'Started'
    },
    
    // --- AI/Review Data ---
    // Field to store the initial AI analysis or key data points
    initial_analysis: {
        type: String,
        default: 'Processing initial file analysis...'
    },
    
    // Array to store the chat history (messages between user and AI)
    chat_history: [{
        role: { type: String, enum: ['user', 'ai'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]

}, { timestamps: true });

module.exports = mongoose.model('ResumeReviewSession', ResumeReviewSessionSchema);