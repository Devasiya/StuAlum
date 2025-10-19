import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mentorshipService from '../services/mentorshipService';
import withSidebarToggle from '../hocs/withSidebarToggle';
import Navbar from '../components/Navbar';

// Mock auth utility - replace with your actual auth context
const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    // Decode token to get user info - replace with your actual token decoding
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (e) {
        return null;
    }
};

const API_BASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_API_BASE_URL) || 'http://localhost:5000';

const MentorshipDashboard = ({ onSidebarToggle }) => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    // Role-based access - allow both students and alumni
    useEffect(() => {
        if (!user || (user.role !== 'student' && user.role !== 'alumni')) {
            navigate('/');
            return;
        }
    }, [user, navigate]);

    const [matches, setMatches] = useState([]);
    const [connections, setConnections] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Alumni-specific states
    const [mentorshipRequests, setMentorshipRequests] = useState([]);
    const [mentorshipHistory, setMentorshipHistory] = useState([]);
    const [mentorshipPreferences, setMentorshipPreferences] = useState({});
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    // Filters state
    const [filters, setFilters] = useState({
        requirements: '',
        role: '',
        skills: '',
        location: '',
        availability: '',
        alumniYear: ''
    });

    // Track if search has been performed
    const [hasSearched, setHasSearched] = useState(false);

    // Modal states
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedMentee, setSelectedMentee] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            if (user.role === 'student') {
                // Student data
                const [connectionsRes, outgoingRes] = await Promise.all([
                    mentorshipService.getMentorshipConnections(),
                    mentorshipService.getOutgoingRequests()
                ]);

                setConnections(connectionsRes.filter(conn => conn.relationship === 'mentor'));
                setOutgoingRequests(outgoingRes);
            } else if (user.role === 'alumni') {
                // Alumni data
                const [requestsRes, connectionsRes, historyRes, preferencesRes, sessionsRes] = await Promise.all([
                    mentorshipService.getMentorshipRequests(),
                    mentorshipService.getMentorshipConnections(),
                    mentorshipService.getMentorshipHistory(),
                    mentorshipService.getMentorshipPreferences(),
                    mentorshipService.getScheduledSessions()
                ]);

                setMentorshipRequests(requestsRes);
                setConnections(connectionsRes.filter(conn => conn.relationship === 'mentee'));
                setMentorshipHistory(historyRes);
                setMentorshipPreferences(preferencesRes);
                setScheduledSessions(sessionsRes);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load mentorship data');
        } finally {
            setLoading(false);
        }
    };

    const handleSmartMatch = async () => {
        try {
            setError(null);
            // Send filters to backend for AI matching
            const response = await mentorshipService.smartMatchMentors(filters.requirements, {
                role: filters.role,
                skills: filters.skills,
                location: filters.location,
                availability: filters.availability,
                alumniYear: filters.alumniYear
            });
            setMatches(response);
            setHasSearched(true);
        } catch (err) {
            console.error('Error fetching matches:', err);
            setError('Failed to find matches');
        }
    };

    const handleRequestMentorship = async (mentorId) => {
        try {
            await mentorshipService.createMentorshipRequest(mentorId);
            alert('Mentorship request sent successfully!');
            fetchDashboardData(); // Refresh data
        } catch (err) {
            console.error('Error sending request:', err);
            alert('Failed to send mentorship request');
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            await mentorshipService.cancelMentorshipRequest(requestId);
            alert('Request cancelled successfully!');
            fetchDashboardData(); // Refresh data
        } catch (err) {
            console.error('Error cancelling request:', err);
            alert('Failed to cancel request');
        }
    };

    // Alumni-specific handlers
    const handleRespondToRequest = async (requestId, action) => {
        try {
            await mentorshipService.respondToMentorshipRequest(requestId, action);
            alert(`Mentorship request ${action}ed successfully!`);
            fetchDashboardData(); // Refresh data
        } catch (err) {
            console.error('Error responding to request:', err);
            alert('Failed to respond to request');
        }
    };

    const handleUpdatePreferences = async (preferences) => {
        try {
            await mentorshipService.updateMentorshipPreferences(preferences);
            alert('Preferences updated successfully!');
            setShowPreferencesModal(false);
            fetchDashboardData(); // Refresh data
        } catch (err) {
            console.error('Error updating preferences:', err);
            alert('Failed to update preferences');
        }
    };

    const handleScheduleSession = async (sessionData) => {
        try {
            await mentorshipService.scheduleMentorshipSession(sessionData);
            alert('Session scheduled successfully!');
            setShowScheduleModal(false);
            fetchDashboardData(); // Refresh data
        } catch (err) {
            console.error('Error scheduling session:', err);
            alert('Failed to schedule session');
        }
    };

    const resetFilters = () => {
        setFilters({
            requirements: '',
            role: '',
            skills: '',
            location: '',
            availability: '',
            alumniYear: ''
        });
        setMatches([]);
        setHasSearched(false);
        setError(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center">
                <div className="text-xl">Loading mentorship dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <>
            {/* Fixed Navbar */}
            <Navbar onSidebarToggle={onSidebarToggle} />

            {/* Main content area with proper spacing */}
            <div className="min-h-screen pt-[60px] px-10 py-5 bg-gradient-to-br from-[#111019] to-[#0a0a0f] text-white">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Mentorship Dashboard</h1>
                        <p className="text-gray-300">
                            {user.role === 'student'
                                ? 'Find mentors, manage connections, and grow your career'
                                : 'Manage mentorship requests, guide mentees, and track your impact'
                            }
                        </p>
                    </div>

                    {user.role === 'student' ? (
                        // STUDENT VIEW
                        <>
                            {/* Section 1: Find a Mentor */}
                            <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
                                <h2 className="text-2xl font-semibold mb-4 text-white relative z-10">Find a Mentor</h2>

                                {/* Search Input */}
                                <div className="mb-4 relative z-10">
                                    <input
                                        type="text"
                                        placeholder="Describe what you're looking for in a mentor (e.g., career guidance, technical skills, leadership)"
                                        value={filters.requirements}
                                        onChange={(e) => setFilters({...filters, requirements: e.target.value})}
                                        className="w-full border border-[#3a3a45] rounded-lg px-4 py-3 text-lg bg-[#1a1a23] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                    />
                                </div>

                                {/* Filters Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 relative z-10">
                                    <select
                                        value={filters.role}
                                        onChange={(e) => setFilters({...filters, role: e.target.value})}
                                        className="border border-[#3a3a45] rounded-lg px-3 py-2 bg-[#1a1a23] text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                    >
                                        <option value="" className="bg-[#1a1a23]">Select Role</option>
                                        <option value="software engineer" className="bg-[#1a1a23]">Software Engineer</option>
                                        <option value="data scientist" className="bg-[#1a1a23]">Data Scientist</option>
                                        <option value="product manager" className="bg-[#1a1a23]">Product Manager</option>
                                        <option value="engineering manager" className="bg-[#1a1a23]">Engineering Manager</option>
                                        <option value="technical lead" className="bg-[#1a1a23]">Technical Lead</option>
                                        <option value="senior engineer" className="bg-[#1a1a23]">Senior Engineer</option>
                                        <option value="principal engineer" className="bg-[#1a1a23]">Principal Engineer</option>
                                        <option value="engineering director" className="bg-[#1a1a23]">Engineering Director</option>
                                        <option value="vp engineering" className="bg-[#1a1a23]">VP Engineering</option>
                                        <option value="cto" className="bg-[#1a1a23]">CTO</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Skills (e.g., Python, Leadership)"
                                        value={filters.skills}
                                        onChange={(e) => setFilters({...filters, skills: e.target.value})}
                                        className="border border-[#3a3a45] rounded-lg px-3 py-2 bg-[#1a1a23] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={filters.location}
                                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                                        className="border border-[#3a3a45] rounded-lg px-3 py-2 bg-[#1a1a23] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                    />

                                    <select
                                        value={filters.availability}
                                        onChange={(e) => setFilters({...filters, availability: e.target.value})}
                                        className="border border-[#3a3a45] rounded-lg px-3 py-2 bg-[#1a1a23] text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                    >
                                        <option value="" className="bg-[#1a1a23]">Availability</option>
                                        <option value="weekly" className="bg-[#1a1a23]">Weekly</option>
                                        <option value="monthly" className="bg-[#1a1a23]">Monthly</option>
                                        <option value="quarterly" className="bg-[#1a1a23]">Quarterly</option>
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Alumni Year"
                                        value={filters.alumniYear}
                                        onChange={(e) => setFilters({...filters, alumniYear: e.target.value})}
                                        className="border border-[#3a3a45] rounded-lg px-3 py-2 bg-[#1a1a23] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                    />
                                </div>

                                <div className="flex gap-2 relative z-10">
                                    <button
                                        onClick={handleSmartMatch}
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                    >
                                        🤖 Smart Match
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Section 2: Mentor Search Results */}
                            <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-24 h-24 bg-purple-600/5 rounded-full blur-2xl"></div>
                                <h2 className="text-2xl font-semibold mb-4 text-white relative z-10">Mentor Search Results</h2>
                                {!hasSearched ? (
                                    <div className="text-center py-8 relative z-10">
                                        <div className="text-gray-400 mb-2">
                                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-300 text-lg">Please enter your requirements and click "Smart Match" to find suitable mentors</p>
                                    </div>
                                ) : matches.length === 0 ? (
                                    <p className="text-gray-300 relative z-10">No matches found. Try adjusting your filters or requirements.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                                        {matches.map((mentor) => (
                                            <div key={mentor._id} className="border border-[#3a3a45] rounded-lg p-4 bg-gradient-to-br from-[#1a1a23] to-[#15151a] hover:border-purple-500/50 transition-all duration-200">
                                                <div className="flex items-center mb-3">
                                                    <img
                                                        src={mentor.profile_photo_url || '/default-avatar.png'}
                                                        alt={mentor.full_name}
                                                        className="w-12 h-12 rounded-full mr-3"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold text-white">{mentor.full_name}</h3>
                                                        <p className="text-sm text-gray-300">{mentor.current_position} at {mentor.company}</p>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="flex items-center mb-1">
                                                        <span className="text-yellow-500">⭐</span>
                                                        <span className="ml-1 text-sm text-gray-300">{mentor.rating} ({mentor.mentee_count} mentees)</span>
                                                    </div>
                                                    <div className="text-sm text-gray-300 mb-2">
                                                        Match Score: {mentor.ai_score}%
                                                    </div>
                                                    <div className="text-xs text-gray-400 mb-2">
                                                        {mentor.match_reason}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {mentor.skills.slice(0, 3).map((skill, index) => (
                                                            <span key={index} className="bg-purple-100/20 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/alumni/profile/${mentor._id}`)}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm hover:scale-105 transition-all duration-200"
                                                    >
                                                        View Profile
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestMentorship(mentor._id)}
                                                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded text-sm hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all duration-200"
                                                    >
                                                        Request Mentorship
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Your Mentors */}
                            <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45] relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-28 h-28 bg-purple-600/5 rounded-full blur-2xl"></div>
                                <h2 className="text-2xl font-semibold mb-4 text-white relative z-10">Your Mentors</h2>
                                {connections.length === 0 ? (
                                    <p className="text-gray-300 relative z-10">No active mentorship connections yet.</p>
                                ) : (
                                    <div className="space-y-4 relative z-10">
                                        {connections.map((connection) => (
                                            <div key={connection._id} className="border border-[#3a3a45] rounded-lg p-4 bg-gradient-to-br from-[#1a1a23] to-[#15151a] hover:border-purple-500/50 transition-all duration-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={connection.mentor_id?.profile_photo_url || '/default-avatar.png'}
                                                            alt={connection.mentor_id?.full_name}
                                                            className="w-12 h-12 rounded-full mr-3"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold text-white">{connection.mentor_id?.full_name}</h3>
                                                            <p className="text-sm text-gray-300">{connection.mentor_id?.current_position} at {connection.mentor_id?.company}</p>
                                                            <p className="text-xs text-gray-400">Next session: Tomorrow at 2:00 PM</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowScheduleModal(true)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm hover:scale-105 transition-all duration-200"
                                                        >
                                                            Reschedule
                                                        </button>
                                                        <button
                                                            onClick={() => setShowNotesModal(true)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm hover:scale-105 transition-all duration-200"
                                                        >
                                                            Notes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Requests & Invitations */}
                            <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-20 h-20 bg-purple-600/5 rounded-full blur-2xl"></div>
                                <h2 className="text-2xl font-semibold mb-4 text-white relative z-10">Requests & Invitations</h2>
                                {outgoingRequests.length === 0 ? (
                                    <p className="text-gray-300 relative z-10">No pending requests.</p>
                                ) : (
                                    <div className="space-y-4 relative z-10">
                                        {outgoingRequests.map((request) => (
                                            <div key={request._id} className="border border-[#3a3a45] rounded-lg p-4 bg-gradient-to-br from-[#1a1a23] to-[#15151a] hover:border-purple-500/50 transition-all duration-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={request.mentor_id?.profile_photo_url || '/default-avatar.png'}
                                                            alt={request.mentor_id?.full_name}
                                                            className="w-12 h-12 rounded-full mr-3"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold text-white">{request.mentor_id?.full_name}</h3>
                                                            <p className="text-sm text-gray-300">{request.mentor_id?.current_position} at {request.mentor_id?.company}</p>
                                                            <p className="text-xs text-gray-400">Status: Waiting for response</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowMessageModal(true)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm hover:scale-105 transition-all duration-200"
                                                        >
                                                            Message
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelRequest(request._id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm hover:scale-105 transition-all duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 5: Mentorship Resources */}
                            <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45] relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/5 rounded-full blur-2xl"></div>
                                <h2 className="text-2xl font-semibold mb-4 text-white relative z-10">Mentorship Resources</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                                    <div className="border border-[#3a3a45] rounded-lg p-4 text-center bg-gradient-to-br from-[#1a1a23] to-[#15151a] hover:border-purple-500/50 transition-all duration-200">
                                        <h3 className="font-semibold mb-2 text-white">Session Agenda</h3>
                                        <p className="text-sm text-gray-300 mb-3">Structured templates for productive mentorship sessions</p>
                                        <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all duration-200">
                                            Download
                                        </button>
                                    </div>
                                    <div className="border border-[#3a3a45] rounded-lg p-4 text-center bg-gradient-to-br from-[#1a1a23] to-[#15151a] hover:border-purple-500/50 transition-all duration-200">
                                        <h3 className="font-semibold mb-2 text-white">SMART Goals</h3>
                                        <p className="text-sm text-gray-300 mb-3">Learn to set Specific, Measurable, Achievable goals</p>
                                        <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all duration-200">
                                            Learn More
                                        </button>
                                    </div>
                                    <div className="border border-[#3a3a45] rounded-lg p-4 text-center bg-gradient-to-br from-[#1a1a23] to-[#15151a] hover:border-purple-500/50 transition-all duration-200">
                                        <h3 className="font-semibold mb-2 text-white">FAQ</h3>
                                        <p className="text-sm text-gray-300 mb-3">Common questions about the mentorship program</p>
                                        <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all duration-200">
                                            View FAQ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // ALUMNI VIEW
                        <>
                            {/* Alumni Navigation Tabs */}
                            <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-4 border border-[#3a3a45] mb-6">
                                <div className="flex space-x-4">
                                    {[
                                        { id: 'overview', label: 'Overview', count: mentorshipRequests.length },
                                        { id: 'requests', label: 'Requests', count: mentorshipRequests.length },
                                        { id: 'mentees', label: 'My Mentees', count: connections.length },
                                        { id: 'history', label: 'History', count: mentorshipHistory.length },
                                        { id: 'sessions', label: 'Sessions', count: scheduledSessions.length },
                                        { id: 'settings', label: 'Settings' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                activeTab === tab.id
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                        >
                                            {tab.label} {tab.count !== undefined && `(${tab.count})`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg p-6 border border-[#3a3a45] text-center">
                                            <div className="text-2xl font-bold text-purple-400">{mentorshipRequests.length}</div>
                                            <div className="text-sm text-gray-300">Pending Requests</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg p-6 border border-[#3a3a45] text-center">
                                            <div className="text-2xl font-bold text-green-400">{connections.length}</div>
                                            <div className="text-sm text-gray-300">Active Mentees</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg p-6 border border-[#3a3a45] text-center">
                                            <div className="text-2xl font-bold text-blue-400">{mentorshipHistory.length}</div>
                                            <div className="text-sm text-gray-300">Completed Relationships</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg p-6 border border-[#3a3a45] text-center">
                                            <div className="text-2xl font-bold text-yellow-400">{scheduledSessions.length}</div>
                                            <div className="text-sm text-gray-300">Upcoming Sessions</div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45]">
                                        <h2 className="text-2xl font-semibold mb-4 text-white">Recent Activity</h2>
                                        <div className="space-y-4">
                                            {mentorshipRequests.slice(0, 3).map(request => (
                                                <div key={request._id} className="flex items-center justify-between p-4 border border-[#3a3a45] rounded-lg">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={request.mentee_id?.profile_photo_url || '/default-avatar.png'}
                                                            alt={request.mentee_id?.full_name}
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                        <div>
                                                            <p className="text-white font-medium">{request.mentee_id?.full_name} requested mentorship</p>
                                                            <p className="text-sm text-gray-400">{new Date(request.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRespondToRequest(request._id, 'accept')}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRespondToRequest(request._id, 'decline')}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {mentorshipRequests.length === 0 && (
                                                <p className="text-gray-300 text-center py-4">No recent activity</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Requests Tab */}
                            {activeTab === 'requests' && (
                                <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45]">
                                    <h2 className="text-2xl font-semibold mb-4 text-white">Mentorship Requests</h2>
                                    {mentorshipRequests.length === 0 ? (
                                        <div className="text-center py-8">
                                            <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
                                            <p className="text-gray-500">No pending mentorship requests</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {mentorshipRequests.map(request => (
                                                <div key={request._id} className="border border-[#3a3a45] rounded-lg p-4">
                                                    <div className="flex items-start space-x-4">
                                                        <img
                                                            src={request.mentee_id?.profile_photo_url || '/default-avatar.png'}
                                                            alt={request.mentee_id?.full_name}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-white">
                                                                {request.mentee_id?.full_name}
                                                            </h3>
                                                            <p className="text-sm text-gray-300">
                                                                {request.mentee_id?.current_position} at {request.mentee_id?.company}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Requested on {new Date(request.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleRespondToRequest(request._id, 'accept')}
                                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleRespondToRequest(request._id, 'decline')}
                                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                            >
                                                                Decline
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mentees Tab */}
                            {activeTab === 'mentees' && (
                                <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45]">
                                    <h2 className="text-2xl font-semibold mb-4 text-white">My Mentees</h2>
                                    {connections.length === 0 ? (
                                        <p className="text-gray-300">No active mentees yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {connections.map((mentee) => (
                                                <div key={mentee._id} className="border border-[#3a3a45] rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={mentee.profile_photo_url || '/default-avatar.png'}
                                                                alt={mentee.full_name}
                                                                className="w-12 h-12 rounded-full mr-3"
                                                            />
                                                            <div>
                                                                <h3 className="font-semibold text-white">{mentee.full_name}</h3>
                                                                <p className="text-sm text-gray-300">{mentee.current_position} at {mentee.company}</p>
                                                                <p className="text-xs text-gray-400">Connected since {new Date(mentee.connected_at).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedMentee(mentee);
                                                                    setShowMessageModal(true);
                                                                }}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                                            >
                                                                Message
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedMentee(mentee);
                                                                    setShowScheduleModal(true);
                                                                }}
                                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                                            >
                                                                Schedule Session
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* History Tab */}
                            {activeTab === 'history' && (
                                <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45]">
                                    <h2 className="text-2xl font-semibold mb-4 text-white">Mentorship History</h2>
                                    {mentorshipHistory.length === 0 ? (
                                        <p className="text-gray-300">No mentorship history yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {mentorshipHistory.map((relationship) => (
                                                <div key={relationship._id} className="border border-[#3a3a45] rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={relationship.mentee.profile_photo_url || '/default-avatar.png'}
                                                                alt={relationship.mentee.full_name}
                                                                className="w-12 h-12 rounded-full mr-3"
                                                            />
                                                            <div>
                                                                <h3 className="font-semibold text-white">{relationship.mentee.full_name}</h3>
                                                                <p className="text-sm text-gray-300">{relationship.mentee.current_position} at {relationship.mentee.company}</p>
                                                                <p className="text-xs text-gray-400">
                                                                    Completed on {new Date(relationship.completed_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-green-400">Completed</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Sessions Tab */}
                            {activeTab === 'sessions' && (
                                <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45]">
                                    <h2 className="text-2xl font-semibold mb-4 text-white">Scheduled Sessions</h2>
                                    {scheduledSessions.length === 0 ? (
                                        <p className="text-gray-300">No scheduled sessions.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {scheduledSessions.map((session) => (
                                                <div key={session._id} className="border border-[#3a3a45] rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={session.mentee.profile_photo_url || '/default-avatar.png'}
                                                                alt={session.mentee.full_name}
                                                                className="w-12 h-12 rounded-full mr-3"
                                                            />
                                                            <div>
                                                                <h3 className="font-semibold text-white">{session.mentee.full_name}</h3>
                                                                <p className="text-sm text-gray-300">
                                                                    {new Date(session.scheduled_date).toLocaleDateString()} at {session.scheduled_time}
                                                                </p>
                                                                <p className="text-xs text-gray-400">{session.topic || 'General mentorship session'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    // Handle reschedule
                                                                    setSelectedMentee(session.mentee);
                                                                    setShowScheduleModal(true);
                                                                }}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                                            >
                                                                Reschedule
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    // Handle cancel session
                                                                    if (window.confirm('Are you sure you want to cancel this session?')) {
                                                                        // Call cancel session API
                                                                    }
                                                                }}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a23] rounded-lg shadow-md p-6 border border-[#3a3a45]">
                                    <h2 className="text-2xl font-semibold mb-4 text-white">Mentorship Preferences</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-3">Availability</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="availability"
                                                        value="weekly"
                                                        checked={mentorshipPreferences.availability === 'weekly'}
                                                        onChange={(e) => setMentorshipPreferences({...mentorshipPreferences, availability: e.target.value})}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-gray-300">Weekly</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="availability"
                                                        value="monthly"
                                                        checked={mentorshipPreferences.availability === 'monthly'}
                                                        onChange={(e) => setMentorshipPreferences({...mentorshipPreferences, availability: e.target.value})}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-gray-300">Monthly</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="availability"
                                                        value="quarterly"
                                                        checked={mentorshipPreferences.availability === 'quarterly'}
                                                        onChange={(e) => setMentorshipPreferences({...mentorshipPreferences, availability: e.target.value})}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-gray-300">Quarterly</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-3">Preferred Skills to Mentor</h3>
                                            <textarea
                                                value={mentorshipPreferences.skills || ''}
                                                onChange={(e) => setMentorshipPreferences({...mentorshipPreferences, skills: e.target.value})}
                                                placeholder="e.g., Python, Leadership, Data Science, Product Management"
                                                className="w-full border border-[#3a3a45] rounded-lg px-3 py-2 bg-[#1a1a23] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                                rows="3"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-3">Maximum Mentees</h3>
                                            <select
                                                value={mentorshipPreferences.max_mentees || 3}
                                                onChange={(e) => setMentorshipPreferences({...mentorshipPreferences, max_mentees: parseInt(e.target.value)})}
                                                className="border border-[#3a3a45] rounded-lg px-3 py-2 bg-[#1a1a23] text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                                            >
                                                <option value={1}>1 mentee</option>
                                                <option value={2}>2 mentees</option>
                                                <option value={3}>3 mentees</option>
                                                <option value={4}>4 mentees</option>
                                                <option value={5}>5 mentees</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleUpdatePreferences(mentorshipPreferences)}
                                                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800"
                                            >
                                                Save Preferences
                                            </button>
                                            <button
                                                onClick={() => setMentorshipPreferences({})}
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modals - These would need to be implemented as separate components */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#23232b] rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Schedule Session</h3>
                        <p className="text-gray-300 mb-4">Modal implementation needed</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#23232b] rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Send Message</h3>
                        <p className="text-gray-300 mb-4">Modal implementation needed</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNotesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#23232b] rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Session Notes</h3>
                        <p className="text-gray-300 mb-4">Modal implementation needed</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowNotesModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPreferencesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#23232b] rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Update Preferences</h3>
                        <p className="text-gray-300 mb-4">Modal implementation needed</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowPreferencesModal(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default withSidebarToggle(MentorshipDashboard);
