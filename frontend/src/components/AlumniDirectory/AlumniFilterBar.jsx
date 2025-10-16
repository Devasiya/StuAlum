// frontend/src/components/AlumniDirectory/AlumniFilterBar.jsx

import React from 'react';

const AlumniFilterBar = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onFilterChange({
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div className="bg-[#3A1869] p-4 rounded-lg shadow-md mb-6 border border-purple-500/50">
            <div className="flex flex-wrap gap-4 items-center mb-4">
                {/* Search Input */}
                <input
                    type="text"
                    name="nameOrKeyword"
                    placeholder="Name or keyword"
                    value={filters.nameOrKeyword}
                    onChange={handleChange}
                    className="flex-1 min-w-[150px] p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
                {/* Grad Year Input (Can be a dropdown/select in reality) */}
                <input
                    type="text"
                    name="gradYear"
                    placeholder="Grad Year"
                    value={filters.gradYear}
                    onChange={handleChange}
                    className="w-full sm:w-auto p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
                {/* Company Input */}
                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={filters.company}
                    onChange={handleChange}
                    className="w-full sm:w-auto p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
                {/* Industry Input */}
                <input
                    type="text"
                    name="industry"
                    placeholder="Industry"
                    value={filters.industry}
                    onChange={handleChange}
                    className="w-full sm:w-auto p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
            </div>

            {/* Chip Filters */}
            <div className="flex flex-wrap gap-3">
                {/* Remote-friendly Chip */}
                <button
                    onClick={() => onFilterChange({ remoteFriendly: !filters.remoteFriendly })}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filters.remoteFriendly ? 'bg-purple-600 text-white' : 'bg-[#2a0e4d] text-gray-300 border border-purple-500 hover:bg-purple-700'
                    }`}
                >
                    <i className="fas fa-map-marker-alt mr-1"></i> Remote-friendly
                </button>

                {/* Hiring Chip */}
                <button
                    onClick={() => onFilterChange({ hiring: !filters.hiring })}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filters.hiring ? 'bg-purple-600 text-white' : 'bg-[#2a0e4d] text-gray-300 border border-purple-500 hover:bg-purple-700'
                    }`}
                >
                    <i className="fas fa-briefcase mr-1"></i> Hiring
                </button>

                {/* Mentor-ready Chip */}
                <button
                    onClick={() => onFilterChange({ mentorReady: !filters.mentorReady })}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filters.mentorReady ? 'bg-purple-600 text-white' : 'bg-[#2a0e4d] text-gray-300 border border-purple-500 hover:bg-purple-700'
                    }`}
                >
                    <i className="fas fa-hands-helping mr-1"></i> Mentor-ready
                </button>

                {/* Class of 2018 Chip (Example of a fixed or pre-defined filter) */}
                <button
                    onClick={() => onFilterChange({ classOf: filters.classOf === '2018' ? '' : '2018' })}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filters.classOf === '2018' ? 'bg-purple-600 text-white' : 'bg-[#2a0e4d] text-gray-300 border border-purple-500 hover:bg-purple-700'
                    }`}
                >
                    <i className="fas fa-graduation-cap mr-1"></i> Class of 2018+
                </button>
            </div>
        </div>
    );
};

export default AlumniFilterBar;