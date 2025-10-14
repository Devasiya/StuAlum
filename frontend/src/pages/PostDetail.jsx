// frontend/src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostDetail, toggleLike } from '../services/forumService';

const Comment = ({ comment }) => {
    const authorName = comment.author_profile_id?.name || 'Anonymous';
    return (
        <div className="border-l-2 border-gray-200 pl-4 py-3 ml-4 bg-gray-50 rounded-r-lg">
            <p className="text-sm font-semibold">{authorName}</p>
            <p className="text-gray-700">{comment.content}</p>
            <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
    );
};

const PostDetail = () => {
    const { postId } = useParams();
    const [data, setData] = useState({ post: null, comments: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const res = await getPostDetail(postId);
                setData(res.data);
            } catch (error) {
                console.error("Failed to load post detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [postId]);

    const handleLike = async () => {
        if (!data.post) return;
        try {
            // Assume we're liking the main post (targetType='Post')
            await toggleLike(data.post._id, 'Post'); 
            
            // Optimistically update the UI
            setData(prev => ({ 
                ...prev, 
                post: { ...prev.post, likes_count: prev.post.likes_count + 1 } 
            }));
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    if (loading) return <div className="p-8">Loading Post Detail...</div>;
    if (!data.post) return <div className="p-8 text-red-500">Post not found.</div>;

    const post = data.post;
    const authorName = post.author_profile_id?.name || 'Unknown Author';
    const authorRole = post.author_model_type === 'AlumniProfile' ? 'Alumnus' : 'Student';
    
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900">{post.title}</h1>
            <div className="text-md text-gray-500 mb-6 border-b pb-4">
                <span className="font-medium">By {authorName} ({authorRole})</span>
                <span className="ml-4">Views: {post.views_count}</span>
                <span className="ml-4">Posted: {new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {/* Post Content */}
            <div className="prose max-w-none mb-8">
                <p>{post.content}</p>
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center space-x-6 border-t pt-4">
                <button onClick={handleLike} className="flex items-center text-blue-600 hover:text-blue-800 transition">
                    <span className="mr-2">👍</span> Like ({post.likes_count})
                </button>
                <button className="text-green-600 hover:text-green-800 transition">
                    💬 Comment ({data.comments.length})
                </button>
                <button className="text-red-600 hover:text-red-800 transition" onClick={() => alert("Reporting post...")}>
                    🚩 Report
                </button>
            </div>

            {/* Comments Section */}
            <h2 className="text-2xl font-bold mt-10 mb-5 border-b pb-2">Comments</h2>
            <div className="space-y-4">
                {data.comments.map(comment => (
                    <Comment key={comment._id} comment={comment} />
                ))}
            </div>
            {/* Comment Submission form would go here */}
        </div>
    );
};

export default PostDetail;