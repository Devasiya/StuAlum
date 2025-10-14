const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostCommentSchema = new Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    
    // --- STANDARDIZED AUTHOR FIELDS ---
    // 🚨 FIX 1: Use 'created_by' for the author ID field, matching PostSchema
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'author_model_type' 
    }, 
    
    // FIX 2: This field remains for dynamic referencing
    author_model_type: { 
        type: String, 
        required: true, 
        enum: ['StudentProfile', 'AlumniProfile'] 
    }, 
    // --- END STANDARDIZED AUTHOR FIELDS ---
    
    content: { type: String, required: true },
    likes_count: { type: Number, default: 0 }, // Assuming comments should also be 'likeable'

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('PostComment', PostCommentSchema);