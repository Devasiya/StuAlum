const mongoose = require('mongoose');

const PostCommentSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    
    // The ID of the Profile (StudentProfile or AlumniProfile)
    author_profile_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'author_model_type' 
    }, 
    
    // The model/collection name (which is also the role)
    author_model_type: { 
        type: String, 
        required: true, 
        enum: ['StudentProfile', 'AlumniProfile'] 
    }, 
    
    content: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('PostComment', PostCommentSchema);