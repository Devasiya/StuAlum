// frontend/src/components/AlumniDirectory/AlumniCard.jsx

import React from 'react';

// 🛑 CRITICAL FIX 1: Define the API base URL for image loading.
// This MUST match the base URL you used in AlumniDirectory.jsx.
const API_BASE_URL = 'http://localhost:5000'; 
const DEFAULT_PROFILE_IMAGE = '/path/to/default/image.png'; // Fallback image path

const AlumniCard = ({ alumnus }) => {
    // Destructure for cleaner access and default values
    const { 
        name, 
        title, 
        company, 
        location, 
        profileImage, 
        tags 
    } = alumnus;

    // 🛑 CRITICAL FIX 2: Construct the full URL for the profile image.
    // This handles both the relative paths (/uploads/...) and missing images.
    const imageSource = profileImage 
        ? `${API_BASE_URL}${profileImage}`
        : DEFAULT_PROFILE_IMAGE;

    // Check if tags is an array before slicing/mapping
    const displayTags = Array.isArray(tags) ? tags : [];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start mb-3">
                {/* Profile Image */}
                <img
                    // Use the constructed full URL
                    src={imageSource} 
                    alt={name || 'Alumnus Profile'}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h3 className="text-lg font-bold truncate">{name}</h3>
                    {/* Title and Company */}
                    <p className="text-sm text-gray-600 truncate">
                        <span className="font-semibold">{title}</span> at {company}
                    </p>
                    {/* Location */}
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                        <i className="fas fa-map-marker-alt mr-1"></i> {location}
                    </p>
                </div>
            </div>

            {/* Tags/Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {/* Use the safe displayTags array */}
                {displayTags.slice(0, 5).map((tag, index) => ( 
                    <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
                    Message
                </button>
                <button className="flex-1 py-2 px-3 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                    Request Mentorship
                </button>
            </div>
        </div>
    );
};

export default AlumniCard;