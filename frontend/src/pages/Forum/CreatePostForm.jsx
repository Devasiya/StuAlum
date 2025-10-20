import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import withSidebarToggle from '../../hocs/withSidebarToggle'; // Correct path
import Navbar from '../../components/Navbar'; // Correct path
// FIX: Corrected path for forumService
import { createPost, getForumCategories } from '../../services/forumService'; 

const CreatePostForm = ({ onSidebarToggle }) => {
    const navigate = useNavigate();
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        forum_id: '', // Corresponds to the category ID
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch categories on mount to populate the dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getForumCategories();
                setCategories(res.data);
                // Set the first category as the default if any exist
                if (res.data.length > 0) {
                    setPostData(prev => ({ ...prev, forum_id: res.data[0]._id }));
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError('Could not load discussion categories.');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!postData.title || !postData.content || !postData.forum_id) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            await createPost(postData); // API call from forumService
            alert('Post created successfully!');
            navigate('/forums'); // Redirect back to the forums list
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create post. Please try again.';
            setError(errorMessage);
            console.error("Post creation error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d]">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-6">Create New Discussion Post</h1>

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
                                    {categories.length === 0 && <option value="">Loading categories...</option>}
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <button 
                                    type="button"
                                    onClick={() => navigate('/forums')}
                                    className="px-6 py-2 border border-gray-400 text-gray-300 rounded-lg hover:bg-[#4d2580] transition font-semibold"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-purple-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Post Discussion'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default withSidebarToggle(CreatePostForm);