// frontend/src/pages/Career/CareerGuidance.jsx (FINAL STATIC VERSION)

import React, { useState, useEffect } from 'react';
import withSidebarToggle from '../../hocs/withSidebarToggle';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

// NOTE: Commented out live service call for static data testing.
// import {
//     getPrepResources,
//     getQASessions
// } from '../../services/careerService';

import ResumeUploadModal from '../../components/Career/ResumeUploadModal';

// --- STATIC MOCK DATA ---
const STATIC_RESOURCES = {
    prepResources: [
        {
            _id: 'p-1',
            title: 'Interview Prep Kit',
            description: 'Question bank, frameworks, mock scripts',
            url: 'https://prepkit.example.com',
            type: 'Kit'
        },
        {
            _id: 'p-2',
            title: 'Behavioral Videos',
            description: 'STAR answers with examples',
            url: 'https://behavioralvideos.example.com',
            type: 'Video'
        },
        {
            _id: 'p-3',
            title: 'Career Blog',
            description: 'Articles from alumni & coaches',
            url: 'https://careerblog.example.com',
            type: 'Article'
        },
        {
            _id: 'p-4',
            title: 'Resume Templates',
            description: 'ATS-friendly designs',
            url: 'https://resumetemplates.example.com',
            type: 'Template'
        },
    ],
    articlesAndVideos: [
        {
            _id: 'a-1',
            title: 'Acing Behavioral Interviews',
            duration_text: '5 min read',
            source_type: 'Article',
            content_url: 'https://interviewarticle.example.com'
        },
        {
            _id: 'a-2',
            title: 'Resume Mistakes to Avoid in 2025',
            duration_text: 'Video • 8 min',
            source_type: 'Video',
            content_url: 'https://resumemistakesvideo.example.com'
        },
    ]
};
// --- END STATIC MOCK DATA ---


// Data for navigation tabs
const TABS = [
    { label: 'Resources', key: 'resources' },
    { label: 'AI Recommendations', key: 'ai' },
    { label: 'Sessions', key: 'sessions' },
];


const CareerGuidance = ({ onSidebarToggle }) => {
    const [activeTab, setActiveTab] = useState('resources');
    const [loading, setLoading] = useState(true);

    const [prepResources, setPrepResources] = useState([]);
    const [articlesAndVideos, setArticlesAndVideos] = useState([]);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const navigate = useNavigate();

    // --- Data Fetching Logic (Static Data) ---
    useEffect(() => {
        const loadStaticResources = () => {
            if (activeTab !== 'resources') return;

            setLoading(true);
            
            // Simulate an API network delay with static data
            const timer = setTimeout(() => {
                setPrepResources(STATIC_RESOURCES.prepResources);
                setArticlesAndVideos(STATIC_RESOURCES.articlesAndVideos);
                setLoading(false);
            }, 500); // 500ms delay

            // Cleanup function
            return () => clearTimeout(timer);
        };

        loadStaticResources();
    }, [activeTab]);


    const handleUploadSuccess = (reviewSessionId) => {
        setIsUploadModalOpen(false);
        window.open(`/career-guidance/ai-chat?sessionId=${reviewSessionId}`, '_blank');
    };


    // --- Helper Components ---

    const PrepResourceCard = ({ title, description, action, link_url }) => (
        // Added flex-col to better structure the content like the screenshot
        <div className="bg-[#3A1869] p-4 rounded-lg flex flex-col justify-between border border-purple-700/50 hover:border-purple-400 transition min-h-[120px]">
            <div className="flex-grow">
                {/* Simple Icon based on resource type */}
                <div className="text-xl mb-2 text-purple-300">
                    {title.includes('Interview') && '📝'}
                    {title.includes('Behavioral') && '🎥'}
                    {title.includes('Blog') && '📰'}
                    {title.includes('Template') && '📄'}
                </div>
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
            <div className="mt-3 self-end">
                <button
                    onClick={() => window.open(link_url, '_blank')}
                    // Using a single blue style for buttons for consistency with 'Open' in the screenshot
                    className={`px-3 py-1 text-sm rounded-lg font-semibold transition bg-blue-600 text-white hover:bg-blue-700`}
                >
                    {/* Dynamic action text based on title/type */}
                    {title.includes('Interview') ? 'Open' : title.includes('Template') ? 'Browse' : title.includes('Blog') ? 'Read' : 'Watch'}
                </button>
            </div>
        </div>
    );

    const ArticleVideoCard = ({ title, duration_text, source_type, content_url }) => (
        <div className="flex justify-between items-center p-3 hover:bg-[#3A1869]/70 rounded-lg transition border-b border-gray-700">
            <div className="flex items-center">
                {/* Placeholder for thumbnail/icon */}
                <div className="w-10 h-10 bg-gray-600 rounded mr-3 flex-shrink-0"></div>
                <div>
                    <p className="text-sm text-white line-clamp-1">{title}</p>
                    <p className="text-xs text-gray-400">{duration_text} • {source_type}</p>
                </div>
            </div>
            <button
                onClick={() => window.open(content_url, '_blank')}
                className="px-3 py-1 text-xs rounded-full bg-purple-600 text-white hover:bg-purple-700"
            >
                {source_type === 'Video' ? 'Watch' : 'Read'}
            </button>
        </div>
    );


    // --- Main Render Function ---
    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen">

                <h1 className="text-3xl font-bold text-white mb-6">Career Guidance</h1>

                {/* --- Tab Navigation --- */}
                <div className="flex space-x-6 border-b border-purple-700 mb-6">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-2 text-lg font-semibold transition-colors
                                    ${activeTab === tab.key
                                        ? 'text-purple-400 border-b-2 border-purple-400'
                                        : 'text-gray-400 hover:text-white'}`
                            }
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- Tab Content --- */}
                <div className="pb-10">


                    {activeTab === 'resources' && (
                        <>
                            {/* FULL WIDTH HEADER: Resume & Interview Prep */}
                            <div className="bg-[#3A1869] p-4 rounded-xl shadow-lg mb-8 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Resume & Interview Prep</h2>
                                    <p className="text-gray-400 text-sm mt-1">Curated kits, video walkthroughs, and alumni tips to land your next role.</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setIsUploadModalOpen(true)} // Opens the modal
                                        className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-gray-200 transition"
                                    >
                                        <span className="mr-2">📄</span> Upload Resume
                                    </button>
                                    <button
                                        onClick={() => setIsUploadModalOpen(true)} // Opens modal for AI Review
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-blue-700 transition"
                                    >
                                        <span className="mr-2">✨</span> AI Review
                                    </button>
                                </div>
                            </div>
                            {/* END FULL WIDTH HEADER */}


                            {/* Main Content is now a single column */}
                            <div className="w-full space-y-8">

                                <h2 className="text-xl font-bold text-white">Prep Resources</h2>
                                {/* Prep Resources Grid */}
                                {loading ? (
                                    <p className="text-purple-300">Loading resources...</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {prepResources?.map((item, index) => (
                                            <PrepResourceCard
                                                key={item._id || index}
                                                title={item.title}
                                                description={item.description}
                                                action={item.action} // Action prop is now unused but kept for compatibility
                                                link_url={item.url}
                                            />
                                        ))}
                                        {/* Removed the "No kits available" message because we are using static data */}
                                    </div>
                                )}

                                {/* Career Articles & Videos */}
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-white mb-4">Career Articles & Videos</h3>
                                    {loading ? (
                                        <p className="text-purple-300">Loading articles...</p>
                                    ) : (
                                        <div className="bg-[#3A1869] p-4 rounded-xl shadow-lg divide-y divide-gray-700">
                                            {articlesAndVideos?.map((item, index) => (
                                                <ArticleVideoCard
                                                    key={item._id || index}
                                                    title={item.title}
                                                    duration_text={item.duration_text}
                                                    source_type={item.source_type}
                                                    content_url={item.content_url}
                                                />
                                            ))}
                                            {/* Removed the "No articles" message because we are using static data */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ===================================================
                        AI RECOMMENDATIONS TAB (Placeholder for future development)
                        =================================================== */}
                    {activeTab === 'ai' && (
                        <div className="max-w-4xl space-y-6">
                            <h2 className="text-3xl font-bold text-white border-b border-purple-700 pb-2">AI Recommendations</h2>
                            <p className="text-gray-400">Content here will show career path and role recommendations based on your uploaded resume and profile data.</p>
                        </div>
                    )}

                    {/* ===================================================
                        SESSIONS TAB (Placeholder for future development)
                        =================================================== */}
                    {activeTab === 'sessions' && (
                        <div className="max-w-4xl space-y-6">
                            <h2 className="text-3xl font-bold text-white border-b border-purple-700 pb-2">Book 1-on-1 Sessions</h2>
                            <p className="text-gray-400">This section will display available Q&A slots with alumni mentors.</p>
                        </div>
                    )}


                    {/* ===================================================
                        ADMIN COMPANIES/ROLES SECTION
                        =================================================== */}
                    <div className="mt-10">
                        <h2 className="text-xl font-bold text-white mb-4">Admin: Companies/Roles Directory</h2>
                        <div className="bg-[#3A1869] p-4 rounded-xl shadow-lg text-gray-300">
                            <p>This section will be used by the Admin to manage the list of companies recruiting and the roles available for easy recommendation/search.</p>
                        </div>
                    </div>

                </div>
            </main>

            <ResumeUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </>
    );
};

export default withSidebarToggle(CareerGuidance);