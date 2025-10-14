import React, { useState, useEffect } from 'react';
import withSidebarToggle from '../hocs/withSidebarToggle'; 
import Navbar from '../components/Navbar'; 
import PostCard from '../components/forums/PostCard';
import { getPostsList, getForumCategories } from '../services/forumService';

const Forums = ({ onSidebarToggle }) => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [loading, setLoading] = useState(true);

    // --- Data Fetching Logic (Robust useEffect) ---
    useEffect(() => {
        const fetchForumData = async () => {
            setLoading(true);
            try {
                // Fetch Categories
                const categoriesRes = await getForumCategories();
                setCategories(categoriesRes.data);

                // Fetch Posts based on the current filter
                const postsRes = await getPostsList({ category: selectedCategory });
                setPosts(postsRes.data);
                
            } catch (error) {
                console.error("Failed to load forum data:", error.response || error);
                setPosts([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchForumData();
    }, [selectedCategory]); 

    const handleCreatePost = () => {
        alert("Navigating to Post Creation form...");
    };

    // --- Render Logic ---
    if (loading) return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            {/* Dark violet background for loading state */}
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d]"> 
                <div className="text-center p-8 text-white">Loading Forums...</div>
            </main>
        </>
    );

    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} /> 

            {/* 1. MAIN CONTENT AREA: Dark Violet Background Applied */}
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d]"> {/* Dark violet background */}
                
                {/* Header and Create Post Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Discussion Forums</h1>
                    <button 
                        onClick={handleCreatePost}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                        + Create Post
                    </button>
                </div>
                
                {/* --- DISCUSSION CATEGORIES BAR --- */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-white">Discussion Categories</h2>
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                        {/* "All" Button - Non-selected state is a darker violet tone */}
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition 
                                ${!selectedCategory ? 'bg-purple-600 text-white' : 'bg-[#3A1869] text-white hover:bg-purple-700'}`}
                        >
                            All
                        </button>
                        
                        {/* Dynamically Rendered Category Buttons */}
                        {categories.map(cat => (
                            <button 
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                // Non-selected buttons use the complementary dark violet tone
                                className={`px-3 py-1 rounded-full text-sm font-medium transition 
                                    ${selectedCategory === cat._id ? 'bg-purple-600 text-white' : 'bg-[#3A1869] text-white hover:bg-purple-700'}`}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </div>
                {/* --- END CATEGORIES BAR --- */}


                {/* Posts List */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="bg-[#3A1869] p-10 rounded-lg shadow-md text-center">
                            <p className="text-lg text-white">No posts found. Start the discussion!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard 
                                key={post._id} 
                                post={post} 
                            />
                        ))
                    )}
                </div>
            </main>
        </>
    );
};

export default withSidebarToggle(Forums);