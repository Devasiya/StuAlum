// frontend/src/pages/Admin/ReportDashboard.jsx

import React, { useState, useEffect } from 'react';
import withSidebarToggle from '../../hocs/withSidebarToggle'; 
import Navbar from '../../components/Navbar'; 
import { getPendingReports, resolveReport } from '../../services/forumService';
import { useNavigate } from 'react-router-dom'; 

// --- Report Card Component (Inner Component) ---
const ReportCard = ({ report, onResolve }) => {
    // Determine the type of reported item
    const itemType = report.reported_item_type;
    
    // Access content safely
    const reportedItem = report.reported_item_id;
    
    // Determine author of the reported content
    const authorName = reportedItem?.created_by?.full_name || 'System/Unknown';

    // Reporter's name
    const reporterName = report.reporter_profile_id?.full_name || 'Anonymous User';

    // The primary content snippet
    const contentSnippet = reportedItem?.content || reportedItem?.title || 'Content Missing';

    return (
        <div className="bg-[#3A1869] p-5 rounded-xl shadow-lg border border-red-500/50">
            
            {/* Header and Status */}
            <div className="flex justify-between items-start border-b border-gray-700 pb-3 mb-3">
                <h3 className="text-lg font-bold text-white">
                    Report ID: <span className="text-red-400">{report._id}</span>
                </h3>
                <span className="text-sm font-semibold px-3 py-1 bg-yellow-600 text-white rounded-full">
                    {report.status}
                </span>
            </div>

            {/* Reported Details */}
            <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-purple-300">Type:</span> {itemType} 
                <span className="ml-4 font-semibold text-purple-300">Reason:</span> {report.reason}
            </p>

            {/* Content Snippet */}
            <div className="bg-[#2a0e4d] p-3 rounded text-sm text-gray-200 mt-3 border border-purple-500/50">
                <p className="font-medium text-purple-300 mb-1">Content Snippet:</p>
                <p className="italic line-clamp-2">{contentSnippet}</p>
                <p className="text-xs mt-1 text-gray-400">Authored by: {authorName}</p>
            </div>
            
            {/* Reporter Info */}
            <div className="text-xs text-gray-400 mt-3">
                Filed by: {reporterName} on {new Date(report.reported_at).toLocaleString()}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-700">
                <button 
                    // 🚨 FIX 1: Wrap in arrow function
                    onClick={() => onResolve(report._id, 'Reviewed - No Action')}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    Ignore/No Action
                </button>
                <button 
                    // 🚨 FIX 2: Wrap in arrow function
                    onClick={() => onResolve(report._id, 'Reviewed - Action Taken')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Mark & Act
                </button>
            </div>
        </div>
    );
};

// --- Main Component ---
const ReportDashboard = ({ onSidebarToggle }) => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPendingReports();
            setReports(res.data);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
            if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                setError('Access Denied. Only administrators can view this dashboard.');
            } else {
                setError('Failed to load reports. Server error.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Initial data fetch
    useEffect(() => {
        fetchReports();
    }, []);

    // Handler to resolve a report
    const handleResolve = async (reportId, status) => {
        try {
            if (!window.confirm(`Are you sure you want to resolve report ${reportId} with status: "${status}"?`)) {
                return;
            }
            await resolveReport(reportId, status);
            
            // Success: Remove the resolved report from the list
            setReports(prev => prev.filter(r => r._id !== reportId));
            
        } catch (err) {
            console.error("Failed to resolve report:", err);
            alert('Failed to resolve report. Check console.');
        }
    };

    // --- Render Logic ---
    if (loading) return (
        <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen">
            <div className="text-center p-8 text-white">Loading Pending Reports...</div>
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
                    <h1 className="text-3xl font-bold text-white mb-6 border-b border-purple-700 pb-3">
                        🚩 Pending Reports ({reports.length})
                    </h1>
                    
                    {reports.length === 0 ? (
                        <div className="bg-[#3A1869] p-10 rounded-xl text-white text-center">
                            <p className="text-xl">🎉 No pending reports! The community is clean.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reports.map(report => (
                                <ReportCard 
                                    key={report._id} 
                                    report={report} 
                                    onResolve={handleResolve} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default withSidebarToggle(ReportDashboard);