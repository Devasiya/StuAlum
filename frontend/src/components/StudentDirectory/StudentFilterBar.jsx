// frontend/src/components/StudentDirectory/StudentFilterBar.jsx

import React from 'react';

const StudentFilterBar = ({ filters, onFilterChange }) => {
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
                    placeholder="Name or keyword (skills, interests, branch)"
                    value={filters.nameOrKeyword}
                    onChange={handleChange}
                    className="flex-1 min-w-[150px] p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
                {/* Branch Input */}
                <input
                    type="text"
                    name="branch"
                    placeholder="Branch (e.g., Computer Science)"
                    value={filters.branch}
                    onChange={handleChange}
                    className="w-full sm:w-auto p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
                {/* Year of Graduation Input */}
                <input
                    type="number"
                    name="yearOfGraduation"
                    placeholder="Year of Graduation"
                    value={filters.yearOfGraduation}
                    onChange={handleChange}
                    className="w-full sm:w-auto p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
                {/* Skills Input */}
                <input
                    type="text"
                    name="skills"
                    placeholder="Skills (e.g., JavaScript, Python)"
                    value={filters.skills}
                    onChange={handleChange}
                    className="w-full sm:w-auto p-2 bg-[#2a0e4d] text-white border border-purple-500 rounded placeholder-gray-400"
                />
            </div>
        </div>
    );
};

export default StudentFilterBar;
