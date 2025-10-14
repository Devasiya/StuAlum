// frontend/src/pages/Forum/PostDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostDetail, toggleLike, deletePost } from '../../services/forumService'; 
import withSidebarToggle from '../../hocs/withSidebarToggle'; 

// IMPORT THE UTILITY FUNCTION (Ensure this file exists and is correctly implemented)
import { getCurrentUserIdFromToken } from '../../utils/authUtils'; 

const Comment = ({ comment }) => {
    const authorName = comment.created_by?.full_name || 'Anonymous';
    
    return (
        <div className="border-l-2 border-violet-700 pl-4 py-3 ml-4 bg-gray-800 rounded-r-lg text-gray-200">
            <p className="text-sm font-semibold text-violet-300">{authorName}</p>
            <p className="text-gray-200">{comment.content}</p>
            <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
    );
};

const PostDetail = () => { 
    const { postId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ post: null, comments: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 1. Get the current user's ID from the utility function
    const currentUserId = getCurrentUserIdFromToken(); 

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const res = await getPostDetail(postId);
                setData(res.data);
            } catch (error) {
                console.error("Failed to load post detail:", error);
                setError(error.response?.data?.message || 'Could not fetch post details.');
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [postId]);

    const handleLike = async () => {
        if (!data.post) return;
        try {
            await toggleLike(data.post._id, 'Post'); 
            setData(prev => ({ 
                ...prev, 
                post: { ...prev.post, likes_count: (prev.post.likes_count || 0) + 1 } 
            }));
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };
    
    const handleUpdate = () => { navigate(`/forums/edit/${postId}`); };
    
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            await deletePost(postId);
            alert('Post deleted successfully!');
            navigate('/forums');
        } catch (err) {
            console.error('Error deleting post:', err);
            setError(err.response?.data?.message || 'Failed to delete post. Check network.');
        }
    };
    
    if (loading) return <div className="p-8 text-violet-400 bg-gray-900 min-h-screen">Loading Post Detail...</div>;
    
    if (!data.post || error) return (
        <div className="p-8 text-red-400 bg-gray-900 min-h-screen">
            {error || 'Post not found.'}
            <button onClick={() => navigate('/forums')} className="text-violet-400 underline ml-2">Go back.</button>
        </div>
    );

    const post = data.post;

    // 🚨 DEBUGGING LOGS START HERE
    const loggedInId = String(currentUserId);
    const creatorId = String(post.created_by?._id);

    console.log("-----------------------------------------");
    console.log("Logged-in User ID (String):", loggedInId);
    console.log("Post Creator ID (String):", creatorId);
    console.log("Are IDs Identical:", loggedInId === creatorId);
    console.log("-----------------------------------------");
    // 🚨 DEBUGGING LOGS END HERE
    
    const authorName = post.created_by?.full_name || 'Unknown Author';
    const authorRole = post.author_model_type === 'AlumniProfile' ? 'Alumnus' : 'Student';
    
    // Final verification check using reliable string comparison
    const isCreator = currentUserId && (loggedInId === creatorId); 
    
    return (
        <div className="p-8 max-w-4xl mx-auto bg-gray-900 min-h-screen text-gray-100">
            <h1 className="text-4xl font-extrabold mb-2 text-violet-400">{post.title}</h1>
            
            <div className="text-md text-gray-400 mb-6 border-b border-gray-700 pb-4">
                <span className="font-medium">By {authorName} ({authorRole})</span>
                <span className="ml-4">Views: {post.views_count}</span>
                <span className="ml-4">Posted: {new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {/* Conditional Rendering of Creator Buttons */}
            {isCreator && (
    <div className="flex space-x-3 mb-8 justify-end"> {/* 👈 Added justify-end to align right */}
        
        {/* Update Button (Prominent Violet/Blue) */}
        <button 
            onClick={handleUpdate}
            // Uses a bright purple base to contrast with the dark background
            className="flex items-center px-4 py-2 text-sm font-semibold rounded-full 
                       bg-purple-600 text-white 
                       hover:bg-purple-700 
                       shadow-md hover:shadow-lg transition duration-200 ease-in-out"
        >
            <span className="mr-1">✏️</span> Edit Post
        </button>
        
        {/* Delete Button (Subtle Dark/Red on Hover) */}
        <button 
            onClick={handleDelete}
            // Uses a dark background so it doesn't stand out, but highlights red on hover
            className="flex items-center px-4 py-2 text-sm font-semibold rounded-full 
                       bg-gray-700 text-red-400 
                       hover:bg-red-700 hover:text-white 
                       shadow-md transition duration-200 ease-in-out"
        >
            <span className="mr-1">🗑️</span> Delete
        </button>
    </div>
)}
            
            {/* Post Content */}
            <div className="prose max-w-none mb-8 text-gray-200">
                <p>{post.content}</p>
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center space-x-6 border-t border-gray-700 pt-4">
                <button onClick={handleLike} className="flex items-center text-violet-400 hover:text-violet-300 transition">
                    <span className="mr-2">👍</span> Like ({post.likes_count || 0})
                </button>
                <button className="text-purple-400 hover:text-purple-300 transition">
                    💬 Comment ({data.comments.length})
                </button>
                <button className="text-red-500 hover:text-red-400 transition" onClick={() => alert("Reporting post...")}>
                    🚩 Report
                </button>
            </div>

            {/* Comments Section */}
            <h2 className="text-2xl font-bold mt-10 mb-5 border-b border-gray-700 pb-2 text-violet-400">Comments</h2>
            <div className="space-y-4">
                {data.comments.map(comment => (
                    <Comment key={comment._id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default withSidebarToggle(PostDetail);