// frontend/src/pages/AlumniDirectory.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import AlumniFilterBar from '../components/AlumniDirectory/AlumniFilterBar';
import AlumniCard from '../components/AlumniDirectory/AlumniCard';
import axios from 'axios';

// Define the base URL for the backend API
// 🛑 CRITICAL FIX: Ensure this matches your backend server address
const API_BASE_URL = 'http://localhost:5000'; 

const AlumniDirectory = () => {
    const [alumniData, setAlumniData] = useState([]);
    const [totalResults, setTotalResults] = useState(0); // State for total count
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        nameOrKeyword: '',
        gradYear: '',
        company: '',
        industry: '',
        remoteFriendly: false,
        hiring: false,
        mentorReady: false,
        classOf: '', // This filter isn't handled in the backend, but kept here
    });

    const fetchAlumni = useCallback(async () => {
        setLoading(true);
        try {
            // FIX 2: Manually build query string to correctly handle boolean filters
            const params = {};
            for (const key in filters) {
                const value = filters[key];
                // Only include non-empty, non-null, and non-false-if-boolean values
                if (value !== '' && value !== null && value !== false) {
                    params[key] = value;
                }
            }
            const queryParams = new URLSearchParams(params).toString();
            
            // FIX 1: Use the explicit base URL for cross-port communication
            const response = await axios.get(`${API_BASE_URL}/api/alumni/directory?${queryParams}`);
            
            const data = response.data;

            // Set both the current page of results and the total count
            setAlumniData(data.alumni || []);
            setTotalResults(data.total || 0);
            
        } catch (error) {
            console.error('Failed to fetch alumni:', error);
            // On error, clear the list and reset the count to show the error state
            setAlumniData([]); 
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Initial fetch and fetch on filter change
    useEffect(() => {
        fetchAlumni();
    }, [fetchAlumni]);

    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };

    return (
        <div className="alumni-directory-layout flex">
            <Sidebar activePage="Alumni Directory" />
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6">Alumni Directory</h1>

                {/* Filter and Search Bar */}
                <AlumniFilterBar filters={filters} onFilterChange={handleFilterChange} />

                <div className="alumni-results my-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Alumni Results
                    </h2>
                    
                    {/* Display total results count */}
                    {totalResults > 0 && (
                        <p className="text-sm text-gray-500 mb-4">
                            Showing 1-{Math.min(alumniData.length, 20)} of {totalResults} results
                        </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-4 mb-6">
                        <button className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
                            <i className="fas fa-download mr-2"></i> Export
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            <i className="fas fa-user-plus mr-2"></i> Invite Alumni
                        </button>
                    </div>

                    {/* Alumni Grid */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {alumniData.map(alumnus => (
                                <AlumniCard key={alumnus.id} alumnus={alumnus} />
                            ))}
                            
                            {/* Display 'No results' message */}
                            {alumniData.length === 0 && (
                                <p className="text-gray-500">No alumni found matching your criteria.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AlumniDirectory;