import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const navigate = useNavigate();
    
    // CRITICAL FIX: Access the name using the correct populated path: post.created_by.full_name
    const authorName = post.created_by?.full_name || 'Unknown User';
    
    // Note: The backend data shows you are passing a post.comments_count, 
    // but the provided JSON only shows likes_count. Assuming 0 for safety.
    const repliesCount = post.comments_count || 0; 
    
    // Assuming you have a way to reliably check the role based on the model type
    const isAlumni = post.author_model_type === 'AlumniProfile';

    // Navigate to the detail page when the card is clicked
    const handlePostClick = () => {
        navigate(`/forums/posts/${post._id}`);
    };

    return (
        <div 
            // CRITICAL CHANGE: Dark violet background, subtle border, strong shadow on hover
            className="bg-[#3A1869] p-6 mb-4 rounded-lg shadow-sm border border-purple-500 cursor-pointer hover:shadow-lg transition"
            onClick={handlePostClick} // Clicking anywhere on the card navigates
        >
            {/* Title - Set text to white */}
            <h3 
                className="text-lg font-semibold text-white" 
            >
                {post.title}
            </h3>

            {/* Post Metadata (Author, Replies, Time) */}
            <p className="text-sm text-gray-300 mt-1">
                by 
                {/* Author Name Display: Lighter color for visibility on dark background */}
                <span className={`font-medium ml-1 ${isAlumni ? 'text-purple-300' : 'text-gray-200'}`}>
                    {authorName}
                </span> 
                
                {/* Replies and Updated Time - Set metadata text to light gray */}
                <span className="ml-4">{repliesCount} replies</span>
                <span className="ml-4">Updated {new Date(post.updated_at).toLocaleDateString()}</span>
            </p>
            {/* NO INTERACTION BUTTONS */}
        </div>
    );
};

export default PostCard;