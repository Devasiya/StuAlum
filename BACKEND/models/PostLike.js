const mongoose = require('mongoose');

const PostLikeSchema = new mongoose.Schema({
    // 1. Who is liking the content?
    liker_profile_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'liker_model_type' 
    },
    liker_model_type: { 
        type: String, 
        required: true, 
        enum: ['StudentProfile', 'AlumniProfile'] 
    },
    
    // 2. What content is being liked?
    target_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'target_model_type' // Can be Post or PostComment
    }, 
    target_model_type: { 
        type: String, 
        required: true, 
        enum: ['Post', 'PostComment'] 
    },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('PostLike', PostLikeSchema);