// frontend/src/components/AlumniDirectory/AlumniCard.jsx

import React from 'react';

// 🛑 ADDED: Import Link for client-side routing
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { getCurrentUserRole } from '../../utils/authUtils';
// Assuming the user is logged in if localStorage has a token
const getToken = () => localStorage.getItem('token');


// 🛑 CRITICAL FIX 1: Define the API base URL for image loading.
const API_BASE_URL = 'http://localhost:5000'; 
const DEFAULT_PROFILE_IMAGE = '/path/to/default/image.png'; // Fallback image path


const AlumniCard = ({ alumnus }) => {
    const navigate = useNavigate();
    const userRole = getCurrentUserRole();

    // Destructure necessary fields.
    const {
        id,
        user_id, // User/Account ID (Target for messaging and requests)
        name,
        title,
        company,
        location,
        profileImage,
        tags
    } = alumnus;

    // Construct the full URL for the profile image.
    const imageSource = profileImage
        ? `${API_BASE_URL}${profileImage}`
        : DEFAULT_PROFILE_IMAGE;

    // Check if tags is an array before slicing/mapping
    const displayTags = Array.isArray(tags) ? tags : [];

    // Handle message button click
    const handleMessage = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop navigation to the profile page

        const token = getToken();
        if (!token) {
            return alert('You must be logged in to start a conversation.');
        }

        try {
            // Create or get conversation with this alumni
            const response = await axios.post(`${API_BASE_URL}/api/messages/conversation`, {
                otherUserId: id // Use the specific user ID for the conversation partner
            }, {
                // 🛑 AUTH FIX: Uses the Authorization: Bearer standard header
                headers: { Authorization: `Bearer ${token}` }
            });

            // Navigate to the messages page with the conversation
            navigate(`/messages/${response.data.conversation._id}`);
        } catch (error) {
            console.error('Error creating conversation:', error);
            // Check for 401/403 and provide better feedback
            const errorMessage = error.response?.status === 401 
                ? 'Unauthorized. Please log in again.' 
                : 'Failed to start conversation. Please try again.';
            alert(errorMessage);
        }
    };

    // Handle mentorship request button click
    const handleMentorshipRequest = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop navigation to the profile page

        const token = getToken();
        if (!token) {
            return alert('You must be logged in to send a mentorship request.');
        }

        try {
            // 🛑 FIX: Use the correct, standardized Authorization header
            const response = await axios.post(`${API_BASE_URL}/api/mentorship/request`, {
                mentor_id: id // Assuming backend expects mentor_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Mentorship request sent successfully!');
        } catch (error) {
            console.error('Error sending mentorship request:', error);
            const errorMessage = error.response?.data?.message || 'Failed to send mentorship request. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        // 🛑 WRAP THE ENTIRE CARD IN A LINK COMPONENT
        <Link 
            to={`/alumni/profile/${id}`} // Dynamically links to the profile ID
            className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out hover:border-blue-400"
        >
            <div className="flex items-start mb-3">
                {/* Profile Image */}
                <img
                    src={imageSource} 
                    alt={name || 'Alumnus Profile'}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1 min-w-0">
                    {/* Name, Title, Company, Location */}
                    <h3 className="text-lg font-bold truncate">{name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                        <span className="font-semibold">{title}</span> at {company}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                        <i className="fas fa-map-marker-alt mr-1"></i> {location}
                    </p>
                </div>
            </div>

            {/* Tags/Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {displayTags.slice(0, 5).map((tag, index) => ( 
                    <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Action Buttons: Use e.preventDefault() to stop the Link from navigating */}
            <div className="flex space-x-2">
                <button
                    className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                    onClick={handleMessage}
                >
                    Message
                </button>
                {userRole === 'student' && (
                    <button
                        className="flex-1 py-2 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                        onClick={handleMentorshipRequest}
                    >
                        Request Mentorship
                    </button>
                )}
            </div>
        </Link>
    );
};

export default AlumniCard;