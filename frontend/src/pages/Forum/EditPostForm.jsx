// frontend/src/pages/Forum/EditPostForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import withSidebarToggle from '../../hocs/withSidebarToggle'; 
import Navbar from '../../components/Navbar'; 
// Import updatePost and getPostDetail
import { getPostDetail, updatePost, getForumCategories } from '../../services/forumService';
// Import the utility for security/redirection checks
import { getCurrentUserIdFromToken } from '../../utils/authUtils'; 

const EditPostForm = ({ onSidebarToggle }) => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [postData, setPostData] = useState({ title: '', content: '', forum_id: '' });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Check ownership immediately (before spending time loading data)
    const currentUserId = getCurrentUserIdFromToken();

    useEffect(() => {
        const fetchData = async () => {
            setError(''); // Clear previous errors
            
            try {
                // 1. Fetch Categories
                const categoriesRes = await getForumCategories();
                setCategories(categoriesRes.data);

                // 2. Fetch Post Details
                const postRes = await getPostDetail(postId);
                const post = postRes.data.post;

                // 🚨 Security Check: Redirect if user does not own the post
                if (String(currentUserId) !== String(post.created_by?._id)) {
                    alert("Unauthorized access. Redirecting.");
                    navigate(`/forums/posts/${postId}`);
                    return;
                }

                // 3. Populate state with fetched data
                setPostData({
                    title: post.title,
                    content: post.content,
                    // Use optional chaining just in case category population failed
                    forum_id: post.forum_id?._id || '', 
                });
                
            } catch (err) {
                console.error("Failed to fetch edit data:", err);
                // Handle 404 or other errors
                setError('Failed to load post for editing. It may not exist or network is down.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [postId, navigate, currentUserId]); // Depend on postId, navigate, and currentUserId

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // Check for required fields before sending
            if (!postData.title || !postData.content || !postData.forum_id) {
                 setError('All fields are required.');
                 setLoading(false);
                 return;
            }

            // 🚨 API Call to Update
            await updatePost(postId, postData);
            navigate(`/forums/posts/${postId}`); // Redirect to the updated post detail

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update post.';
            setError(errorMessage);
            console.error("Post update error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Render Logic ---
    if (loading) return (
        <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d]">
            <div className="text-center p-8 text-white">Loading Post for Editing...</div>
        </main>
    );
    
    // Display error message if initial fetch failed
    if (error && !postData.title) return (
        <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d]">
            <div className="text-center p-10 text-red-400 bg-[#3A1869] rounded-xl max-w-xl mx-auto">{error}</div>
        </main>
    );


    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d]">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-6">Edit Discussion Post</h1>

                    <div className="bg-[#3A1869] p-8 rounded-xl shadow-2xl">
                        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Title Field */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Post Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={postData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Keep your title concise and engaging"
                                    maxLength="150"
                                />
                            </div>

                            {/* Content Field */}
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={postData.content}
                                    onChange={handleChange}
                                    required
                                    rows="8"
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Write your main discussion content here..."
                                ></textarea>
                            </div>

                            {/* Category Dropdown */}
                            <div className="mb-6">
                                <label htmlFor="forum_id" className="block text-sm font-medium text-gray-300 mb-2">Select Category</label>
                                <select
                                    id="forum_id"
                                    name="forum_id"
                                    value={postData.forum_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="" disabled>Select a Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <button 
                                    type="button"
                                    onClick={() => navigate(`/forums/posts/${postId}`)}
                                    className="px-6 py-2 border border-gray-400 text-gray-300 rounded-lg hover:bg-[#4d2580] transition font-semibold"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-purple-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default withSidebarToggle(EditPostForm);