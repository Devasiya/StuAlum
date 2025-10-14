// frontend/src/pages/Forum/PostDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Ensure all service functions are imported
import { getPostDetail, toggleLike, deletePost, createComment, deleteComment } from '../../services/forumService'; 
import withSidebarToggle from '../../hocs/withSidebarToggle'; 
import { getCurrentUserIdFromToken } from '../../utils/authUtils'; 

// ----------------------------------------------------------------------------------------
// --- COMMENT COMPONENT ---
// ----------------------------------------------------------------------------------------
const Comment = ({ comment, currentUserId, onDelete, onLike }) => {
    const authorName = comment.created_by?.full_name || 'Anonymous';
    
    // Check if the current user is the comment creator
    const isCommentCreator = currentUserId && (String(currentUserId) === String(comment.created_by?._id));

    return (
        <div className="border-l-2 border-violet-700 pl-4 py-3 ml-4 bg-gray-800 rounded-r-lg text-gray-200">
            <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-violet-300">{authorName}</p>
                
                <div className="flex items-center space-x-2">
                    {/* 🚨 Comment Like Button: Calls parent handler */}
                    <button 
                        onClick={() => onLike(comment._id)} 
                        className="text-xs text-violet-400 hover:text-violet-300 transition"
                        title={comment.userLiked ? "Unlike" : "Like"} 
                    >
                        {/* Visual toggle based on userLiked state from the backend */}
                        <span className="mr-1">{comment.userLiked ? '❤️' : '♡'}</span> 
                        Like ({comment.likes_count || 0})
                    </button>
                    
                    {/* Conditional Delete Button */}
                    {isCommentCreator && (
                        <button 
                            onClick={() => onDelete(comment._id)} 
                            className="text-xs text-red-400 hover:text-red-300 ml-4 p-1 rounded-full transition"
                            title="Delete this comment"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
            <p className="text-gray-200">{comment.content}</p>
            <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
    );
};

// ----------------------------------------------------------------------------------------
// --- MAIN COMPONENT ---
// ----------------------------------------------------------------------------------------
const PostDetail = () => { 
    const { postId } = useParams();
    const navigate = useNavigate();
    
    const [data, setData] = useState({ post: null, comments: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [newCommentContent, setNewCommentContent] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    
    const currentUserId = getCurrentUserIdFromToken();

    // --- Data Fetching ---
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

    // --- HANDLERS ---
    
    // Post Liking Handler (Toggle Post Like)
    const handleLike = async () => {
        if (!data.post) return;
        
        const targetId = data.post._id; 
        const targetType = 'Post'; 

        try {
            const res = await toggleLike(targetId, targetType);
            const { increment } = res.data; 
            
            // Optimistically update the UI count and the userLiked state
            setData(prev => ({ 
                ...prev, 
                post: { 
                    ...prev.post, 
                    likes_count: (prev.post.likes_count || 0) + increment,
                    userLiked: increment === 1 // True if incremented (liked)
                } 
            }));
            
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };
    
    // 🚨 Comment Liking Handler (Toggle Comment Like)
    const handleCommentLike = async (commentId) => {
        try {
            const targetType = 'PostComment'; 
            const res = await toggleLike(commentId, targetType);
            const { increment } = res.data; 

            // Update the state of the specific comment in the comments array
            setData(prev => ({
                ...prev,
                comments: prev.comments.map(c => {
                    if (String(c._id) === String(commentId)) {
                        return {
                            ...c,
                            likes_count: (c.likes_count || 0) + increment,
                            userLiked: increment === 1 // Toggle status
                        };
                    }
                    return c;
                })
            }));

        } catch (error) {
            console.error("Failed to toggle comment like:", error);
        }
    };


    const handleUpdate = () => { navigate(`/forums/edit/${postId}`); };
    
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
        try {
            await deletePost(postId);
            alert('Post deleted successfully!');
            navigate('/forums');
        } catch (err) {
            console.error('Error deleting post:', err);
            setError(err.response?.data?.message || 'Failed to delete post. Check network.');
        }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentContent.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const commentData = { post_id: postId, content: newCommentContent.trim() };
            const res = await createComment(commentData);

            setData(prev => ({ 
                ...prev, 
                comments: [...prev.comments, res.data],
                post: { ...prev.post, comments_count: (prev.post.comments_count || 0) + 1 } 
            }));
            
            setNewCommentContent(''); // Clear the input
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError(err.response?.data?.message || 'Failed to post comment.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteComment(commentId);
            
            setData(prev => ({
                ...prev,
                comments: prev.comments.filter(c => c._id !== commentId),
                post: { ...prev.post, comments_count: (prev.post.comments_count || 0) - 1 }
            }));
            
        } catch (err) {
            console.error('Error deleting comment:', err);
            setError(err.response?.data?.message || 'Failed to delete comment.');
        }
    };


    // --- RENDER CHECKS ---
    if (loading) return <div className="p-8 text-violet-400 bg-gray-900 min-h-screen">Loading Post Detail...</div>;
    
    if (!data.post || error) return (
        <div className="p-8 text-red-400 bg-gray-900 min-h-screen">
            {error || 'Post not found.'}
            <button onClick={() => navigate('/forums')} className="text-violet-400 underline ml-2">Go back.</button>
        </div>
    );

    const post = data.post;
    const loggedInId = String(currentUserId);
    const creatorId = String(post.created_by?._id);
    
    const authorName = post.created_by?.full_name || 'Unknown Author';
    const authorRole = post.author_model_type === 'AlumniProfile' ? 'Alumnus' : 'Student';
    
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
                <div className="flex space-x-3 mb-8 justify-end">
                    <button 
                        onClick={handleUpdate}
                        className="flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg transition duration-200 ease-in-out"
                    >
                        ✏️ Edit Post
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-gray-700 text-red-400 hover:bg-red-700 hover:text-white shadow-md transition duration-200 ease-in-out"
                    >
                        🗑️ Delete
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
                    <span className="mr-2">{post.userLiked ? '❤️' : '♡'}</span> 
                    {post.userLiked ? 'Unlike' : 'Like'} ({post.likes_count || 0})
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
            
            {/* Comment Submission Form */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-3 select-none text-white">Add a Comment</h3>
                {error && <p className="text-red-400 mb-3">{error}</p>}
                
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        rows="3"
                        placeholder="Share your thoughts..."
                        className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                        required
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newCommentContent.trim()}
                        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-purple-400"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            </div>
            
            {/* List of existing comments */}
            <div className="space-y-4">
                {data.comments.length > 0 ? (
                    data.comments.map((comment, index) => (
                        // Pass currentUserId and the deletion handler down to the Comment component
                        <Comment 
                            key={comment._id ? String(comment._id) : index} 
                            comment={comment} 
                            currentUserId={currentUserId}
                            onDelete={handleCommentDelete}
                            onLike={handleCommentLike} // 👈 Pass comment like handler
                        />
                    ))
                ) : (
                    <p className="text-gray-400">Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default withSidebarToggle(PostDetail);