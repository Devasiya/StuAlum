const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    // Correct field name to match existing data
    forum_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    
    // CRITICAL FIX: Changed field name to created_by
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'author_model_type' // This remains the dynamic reference field
    }, 
    
    author_model_type: { 
        type: String, 
        required: true, 
        enum: ['StudentProfile', 'AlumniProfile'] 
    }, 
    
    likes_count: { type: Number, default: 0 },
    views_count: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Post', PostSchema);