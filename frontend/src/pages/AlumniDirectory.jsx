// frontend/src/pages/AlumniDirectory.jsx

import React, { useState, useEffect, useCallback } from 'react';
import withSidebarToggle from '../hocs/withSidebarToggle';
import Navbar from '../components/Navbar';
import AlumniFilterBar from '../components/AlumniDirectory/AlumniFilterBar';
import AlumniCard from '../components/AlumniDirectory/AlumniCard';
import InviteModal from '../components/InviteModal';
import api from '../services/api';
import { getCurrentUserRole } from '../utils/authUtils';

// Define the base URL for the backend API
const API_BASE_URL = 'http://localhost:5000';

const AlumniDirectory = ({ onSidebarToggle }) => {
    const [alumniData, setAlumniData] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const userRole = getCurrentUserRole();

    const [page, setPage] = useState(1);
    const LIMIT = 20;

    const [filters, setFilters] = useState({
        nameOrKeyword: '', gradYear: '', company: '', industry: '',
        remoteFriendly: false, hiring: false, mentorReady: false, classOf: '', 
    });

    const fetchAlumni = useCallback(async () => {
        setLoading(true);
        // ... (fetch logic remains the same)
        try {
            const params = {};
            for (const key in filters) {
                const value = filters[key];
                if (value !== '' && value !== null && value !== false) {
                    params[key] = value;
                }
            }
            params.limit = LIMIT;
            params.skip = (page - 1) * LIMIT;
            const queryParams = new URLSearchParams(params).toString();
            const response = await api.get(`/alumni/directory?${queryParams}`);
            const data = response.data;
            setAlumniData(data.alumni || []);
            setTotalResults(data.total || 0);
        } catch (error) {
            console.error('Failed to fetch alumni:', error);
            setAlumniData([]); 
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchAlumni();
    }, [fetchAlumni]);

    const handleFilterChange = (newFilters) => {
        setPage(1);
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };

    const handleExport = () => {
        const params = {};
        for (const key in filters) {
            const value = filters[key];
            if (value !== '' && value !== null && value !== false) {
                params[key] = value;
            }
        }
        const queryParams = new URLSearchParams(params).toString();
        const exportUrl = `${API_BASE_URL}/api/alumni/export?${queryParams}`;
        window.open(exportUrl, '_self');
    };

    // 🛑 NEW FUNCTION: Handles the invite button click and modal submission
    const handleInviteSubmit = async (emailListString) => {
        const emails = emailListString.split(',').map(e => e.trim()).filter(e => e.length > 0);
        try {
            const response = await api.post('/alumni/invite', { emails });
            setIsInviteModalOpen(false); // Close modal on success
            alert(response.data.message);
        } catch (error) {
            console.error('Error sending invitations:', error);
            // Use the error message from the backend if available
            const errorMessage = error.response?.data?.message || 'Failed to send invitations. Please try again.';
            alert(errorMessage);
        }
    };


    const currentPageEnd = Math.min(page * LIMIT, totalResults);
    const currentPageStart = totalResults > 0 ? (page - 1) * LIMIT + 1 : 0;


    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="min-h-screen overflow-y-auto pt-[60px] px-10 py-5 bg-[#111019] text-white">
                <h1 className="text-3xl font-bold mb-6">Alumni Directory</h1>

                {/* Filter and Search Bar */}
                <AlumniFilterBar filters={filters} onFilterChange={handleFilterChange} />

                <div className="alumni-results my-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">
                        Alumni Results
                    </h2>

                    {totalResults > 0 && (
                        <p className="text-sm text-gray-300 mb-4">
                            Showing {currentPageStart}-{currentPageEnd} of {totalResults} results
                        </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700"
                            onClick={handleExport}
                        >
                            <i className="fas fa-download mr-2"></i> Export
                        </button>
                        {userRole === 'admin' && (
                            <button onClick={() => setIsInviteModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                <i className="fas fa-user-plus mr-2"></i> Invite Alumni
                            </button>
                        )}
                    </div>

                    {/* Alumni Grid */}
                    {loading ? (
                        <p className="text-white">Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {alumniData.map(alumnus => (
                                <AlumniCard key={alumnus.id} alumnus={alumnus} />
                            ))}

                            {alumniData.length === 0 && (
                                <p className="text-gray-400">No alumni found matching your criteria.</p>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls (Placeholder for future implementation) */}
                    {totalResults > LIMIT && (
                        <div className="flex justify-center mt-6 space-x-4">
                            <button disabled={page === 1} className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700">Previous</button>
                            <span className="py-2 text-white">Page {page}</span>
                            <button disabled={page * LIMIT >= totalResults} className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700">Next</button>
                        </div>
                    )}
                </div>
            </main>
            {isInviteModalOpen && (
                <InviteModal
                    onClose={() => setIsInviteModalOpen(false)}
                    onSubmit={handleInviteSubmit}
                />
            )}
        </>
    );
};

export default withSidebarToggle(AlumniDirectory);
