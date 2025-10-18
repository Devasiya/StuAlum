import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import mentorshipService from '../services/mentorshipService';

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

const MentorshipDashboard = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    // Role-based access
    useEffect(() => {
        if (!user || user.role !== 'student') {
            navigate('/');
            return;
        }
    }, [user, navigate]);

    const [matches, setMatches] = useState([]);
    const [connections, setConnections] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters state
    const [filters, setFilters] = useState({
        requirements: '',
        industry: '',
        role: '',
        skills: '',
        location: '',
        availability: '',
        alumniYear: ''
    });

    // Modal states
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [matchesRes, connectionsRes, outgoingRes] = await Promise.all([
                mentorshipService.getMentorshipMatches(),
                mentorshipService.getMentorshipConnections(),
                mentorshipService.getOutgoingRequests()
            ]);

            setMatches(matchesRes);
            setConnections(connectionsRes.filter(conn => conn.relationship === 'mentor'));
            setOutgoingRequests(outgoingRes);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load mentorship data');
        } finally {
            setLoading(false);
        }
    };

    const handleSmartMatch = async () => {
        try {
            // Send filters to backend for AI matching
            const response = await axios.post(`${API_BASE_URL}/api/mentorship/smart-match`, {
                requirements: filters.requirements,
                filters: {
                    industry: filters.industry,
                    role: filters.role,
                    skills: filters.skills,
                    location: filters.location,
                    availability: filters.availability,
                    alumniYear: filters.alumniYear
                }
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMatches(response.data);
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

    const resetFilters = () => {
        setFilters({
            requirements: '',
            industry: '',
            role: '',
            skills: '',
            location: '',
            availability: '',
            alumniYear: ''
        });
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
        <div className="min-h-screen bg-[#f4f7f9] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Mentorship Dashboard</h1>
                    <p className="text-gray-600">Find mentors, manage connections, and grow your career</p>
                </div>

                {/* Section 1: Find a Mentor */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Find a Mentor</h2>

                    {/* Search Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Describe what you're looking for in a mentor (e.g., career guidance, technical skills, leadership)"
                            value={filters.requirements}
                            onChange={(e) => setFilters({...filters, requirements: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg"
                        />
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                            value={filters.industry}
                            onChange={(e) => setFilters({...filters, industry: e.target.value})}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Select Industry</option>
                            <option value="tech">Technology</option>
                            <option value="finance">Finance</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="education">Education</option>
                            <option value="consulting">Consulting</option>
                        </select>

                        <select
                            value={filters.role}
                            onChange={(e) => setFilters({...filters, role: e.target.value})}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Select Role</option>
                            <option value="engineer">Engineer</option>
                            <option value="manager">Manager</option>
                            <option value="executive">Executive</option>
                            <option value="consultant">Consultant</option>
                            <option value="entrepreneur">Entrepreneur</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Skills (e.g., Python, Leadership)"
                            value={filters.skills}
                            onChange={(e) => setFilters({...filters, skills: e.target.value})}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        />

                        <select
                            value={filters.availability}
                            onChange={(e) => setFilters({...filters, availability: e.target.value})}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Availability</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Alumni Year"
                            value={filters.alumniYear}
                            onChange={(e) => setFilters({...filters, alumniYear: e.target.value})}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSmartMatch}
                            className="bg-[#007bff] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            🤖 Smart Match
                        </button>
                        <button
                            onClick={resetFilters}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Section 2: Mentor Search Results */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Mentor Search Results</h2>
                    {matches.length === 0 ? (
                        <p className="text-gray-500">No matches found. Try adjusting your filters or use Smart Match.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matches.map((mentor) => (
                                <div key={mentor._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center mb-3">
                                        <img
                                            src={mentor.profile_photo_url || '/default-avatar.png'}
                                            alt={mentor.full_name}
                                            className="w-12 h-12 rounded-full mr-3"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{mentor.full_name}</h3>
                                            <p className="text-sm text-gray-600">{mentor.current_position} at {mentor.company}</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center mb-1">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="ml-1 text-sm">{mentor.rating} ({mentor.mentee_count} mentees)</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-2">
                                            Match Score: {mentor.ai_score}%
                                        </div>
                                        <div className="text-xs text-gray-500 mb-2">
                                            {mentor.match_reason}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {mentor.skills.slice(0, 3).map((skill, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/alumni/profile/${mentor._id}`)}
                                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => handleRequestMentorship(mentor._id)}
                                            className="bg-[#007bff] text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
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
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Your Mentors</h2>
                    {connections.length === 0 ? (
                        <p className="text-gray-500">No active mentorship connections yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {connections.map((mentor) => (
                                <div key={mentor._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={mentor.profile_photo_url || '/default-avatar.png'}
                                                alt={mentor.full_name}
                                                className="w-12 h-12 rounded-full mr-3"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{mentor.full_name}</h3>
                                                <p className="text-sm text-gray-600">{mentor.current_position} at {mentor.company}</p>
                                                <p className="text-xs text-gray-500">Next session: Tomorrow at 2:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowScheduleModal(true)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Reschedule
                                            </button>
                                            <button
                                                onClick={() => setShowNotesModal(true)}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
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
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Requests & Invitations</h2>
                    {outgoingRequests.length === 0 ? (
                        <p className="text-gray-500">No pending requests.</p>
                    ) : (
                        <div className="space-y-4">
                            {outgoingRequests.map((request) => (
                                <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={request.mentor.profile_photo_url || '/default-avatar.png'}
                                                alt={request.mentor.full_name}
                                                className="w-12 h-12 rounded-full mr-3"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{request.mentor.full_name}</h3>
                                                <p className="text-sm text-gray-600">{request.mentor.current_position} at {request.mentor.company}</p>
                                                <p className="text-xs text-gray-500">Status: Waiting for response</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowMessageModal(true)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Message
                                            </button>
                                            <button
                                                onClick={() => handleCancelRequest(request._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Mentorship Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4 text-center">
                            <h3 className="font-semibold mb-2">Session Agenda</h3>
                            <p className="text-sm text-gray-600 mb-3">Structured templates for productive mentorship sessions</p>
                            <button className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-700">
                                Download
                            </button>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 text-center">
                            <h3 className="font-semibold mb-2">SMART Goals</h3>
                            <p className="text-sm text-gray-600 mb-3">Learn to set Specific, Measurable, Achievable goals</p>
                            <button className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-700">
                                Learn More
                            </button>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 text-center">
                            <h3 className="font-semibold mb-2">FAQ</h3>
                            <p className="text-sm text-gray-600 mb-3">Common questions about the mentorship program</p>
                            <button className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-700">
                                View FAQ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mock Modals - Replace with actual modal components */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Schedule Session</h3>
                        <p className="text-gray-600 mb-4">Mock modal - Schedule functionality to be implemented</p>
                        <button
                            onClick={() => setShowScheduleModal(false)}
                            className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Send Message</h3>
                        <p className="text-gray-600 mb-4">Mock modal - Messaging functionality to be implemented</p>
                        <button
                            onClick={() => setShowMessageModal(false)}
                            className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showNotesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Session Notes</h3>
                        <p className="text-gray-600 mb-4">Mock modal - Notes functionality to be implemented</p>
                        <button
                            onClick={() => setShowNotesModal(false)}
                            className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorshipDashboard;
