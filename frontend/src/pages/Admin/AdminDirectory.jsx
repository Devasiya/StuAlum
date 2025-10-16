// frontend/src/pages/Admin/AdminDirectory.jsx

import React, { useState, useEffect } from 'react';
import withSidebarToggle from '../../hocs/withSidebarToggle';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getAlumniDirectory, inviteAlumni, exportAlumniToCSV } from '../../services/api';
import InviteModal from '../../components/InviteModal';

const AdminDirectory = ({ onSidebarToggle }) => {
    const navigate = useNavigate();
    const [alumni, setAlumni] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        nameOrKeyword: '',
        gradYear: '',
        company: '',
        industry: '',
        remoteFriendly: false,
        hiring: false,
        mentorReady: false,
        limit: 20,
        skip: 0,
    });
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const fetchAlumni = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== false) {
                    queryParams.append(key, value);
                }
            });
            const res = await getAlumniDirectory(queryParams.toString());
            setAlumni(res.data.alumni);
            setTotal(res.data.total);
        } catch (err) {
            console.error('Failed to fetch alumni:', err);
            setError('Failed to load alumni directory.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            skip: 0, // Reset pagination on filter change
        }));
    };

    const handlePageChange = (newSkip) => {
        setFilters(prev => ({ ...prev, skip: newSkip }));
    };

    const handleInvite = async (emails) => {
        try {
            await inviteAlumni(emails);
            alert('Invitations sent successfully!');
            setIsInviteModalOpen(false);
        } catch (err) {
            console.error('Failed to send invitations:', err);
            alert('Failed to send invitations.');
        }
    };

    const handleExport = async () => {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== false) {
                    queryParams.append(key, value);
                }
            });
            const response = await exportAlumniToCSV(queryParams.toString());
            // Trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'alumni_directory_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to export CSV:', err);
            alert('Failed to export CSV.');
        }
    };

    if (loading) return (
        <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen">
            <div className="text-center p-8 text-white">Loading Alumni Directory...</div>
        </main>
    );

    if (error) return (
        <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen">
            <div className="bg-red-900 p-10 rounded-xl text-white max-w-lg mx-auto">
                <h1 className="text-xl font-bold mb-3">Error</h1>
                <p>{error}</p>
                <button onClick={() => navigate('/')} className="mt-4 underline text-red-300">Go to Dashboard</button>
            </div>
        </main>
    );

    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">Admin Alumni Directory</h1>
                        <div className="space-x-3">
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Invite Alumni
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-[#3A1869] p-5 rounded-xl mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                                type="text"
                                name="nameOrKeyword"
                                placeholder="Name or Keyword"
                                value={filters.nameOrKeyword}
                                onChange={handleFilterChange}
                                className="px-3 py-2 bg-[#2a0e4d] text-white rounded border border-purple-500"
                            />
                            <input
                                type="number"
                                name="gradYear"
                                placeholder="Graduation Year"
                                value={filters.gradYear}
                                onChange={handleFilterChange}
                                className="px-3 py-2 bg-[#2a0e4d] text-white rounded border border-purple-500"
                            />
                            <input
                                type="text"
                                name="company"
                                placeholder="Company"
                                value={filters.company}
                                onChange={handleFilterChange}
                                className="px-3 py-2 bg-[#2a0e4d] text-white rounded border border-purple-500"
                            />
                            <input
                                type="text"
                                name="industry"
                                placeholder="Industry"
                                value={filters.industry}
                                onChange={handleFilterChange}
                                className="px-3 py-2 bg-[#2a0e4d] text-white rounded border border-purple-500"
                            />
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <label className="flex items-center text-white">
                                <input
                                    type="checkbox"
                                    name="remoteFriendly"
                                    checked={filters.remoteFriendly}
                                    onChange={handleFilterChange}
                                    className="mr-2"
                                />
                                Remote Friendly
                            </label>
                            <label className="flex items-center text-white">
                                <input
                                    type="checkbox"
                                    name="hiring"
                                    checked={filters.hiring}
                                    onChange={handleFilterChange}
                                    className="mr-2"
                                />
                                Hiring
                            </label>
                            <label className="flex items-center text-white">
                                <input
                                    type="checkbox"
                                    name="mentorReady"
                                    checked={filters.mentorReady}
                                    onChange={handleFilterChange}
                                    className="mr-2"
                                />
                                Mentor Ready
                            </label>
                        </div>
                    </div>

                    {/* Alumni List */}
                    <div className="space-y-4">
                        {alumni.map(alumnus => (
                            <div key={alumnus.id} className="bg-[#3A1869] p-5 rounded-xl shadow-lg">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={alumnus.profileImage}
                                        alt={alumnus.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white">{alumnus.name}</h3>
                                        <p className="text-purple-300">{alumnus.title} at {alumnus.company}</p>
                                        <p className="text-gray-400">{alumnus.location} • Grad Year: {alumnus.gradYear}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {alumnus.tags.map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/alumni/${alumnus.id}`)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {total > filters.limit && (
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                onClick={() => handlePageChange(Math.max(0, filters.skip - filters.limit))}
                                disabled={filters.skip === 0}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-white self-center">
                                Page {Math.floor(filters.skip / filters.limit) + 1} of {Math.ceil(total / filters.limit)}
                            </span>
                            <button
                                onClick={() => handlePageChange(filters.skip + filters.limit)}
                                disabled={filters.skip + filters.limit >= total}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />
        </>
    );
};

export default withSidebarToggle(AdminDirectory);
