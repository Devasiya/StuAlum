const mongoose = require('mongoose');

const PostReportSchema = new mongoose.Schema({
    // --- 1. Reported Content Identification ---
    
    // The ID of the Post or PostComment being reported
    reported_item_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'reported_item_type' 
    },
    // The model name of the reported content
    reported_item_type: { 
        type: String, 
        required: true, 
        enum: ['Post', 'PostComment'] 
    }, 

    // --- 2. Reporter Identification (Who filed the report) ---
    
    // The ID of the StudentProfile or AlumniProfile who filed the report
    reporter_profile_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'reporter_model_type' 
    },
    // 🚨 FIX 1: Using the full model names as defined in your files
    reporter_model_type: { 
        type: String, 
        required: true, 
        enum: ['StudentProfile', 'AlumniProfile'] 
    },
    
    // --- 3. Report Details ---
    
    reason: { 
        type: String, 
        required: true, 
        enum: ['Spam', 'Hate Speech', 'Inappropriate Content', 'Other'] 
    }, 
    details: { 
        type: String, 
        default: '' 
    },
    
    // --- 4. Admin Management Fields ---
    
    status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'Reviewed - Action Taken', 'Reviewed - No Action'] 
    },
    // 🚨 FIX 2: Using the full model name for the static Admin reference
    resolved_by_admin_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'AdminProfile', // Must match the name used in mongoose.model('AdminProfile', ...)
        default: null 
    }, 
    resolved_at: { type: Date },
}, { timestamps: { createdAt: 'reported_at' } });

module.exports = mongoose.model('PostReport', PostReportSchema);