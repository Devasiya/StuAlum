// frontend/src/pages/Events/CreateEventForm.jsx

import React, { useState } from 'react';
import withSidebarToggle from '../../hocs/withSidebarToggle'; 
import Navbar from '../../components/Navbar'; 
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService';

// Data from your EventSchema enums
const CATEGORIES = ['Workshop', 'Networking', 'Career Fair', 'Meetup', 'Other'];
const AUDIENCES = ['students', 'alumni', 'all'];
const MODES = ['in_person', 'virtual', 'hybrid'];

const CreateEventForm = ({ onSidebarToggle }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES[0],
        audience: AUDIENCES[0],
        location: '', // Physical address or link
        event_mode: MODES[0],
        start_time: '', // Will store ISO string from datetime-local input
        end_time: '',
        capacity: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Ensure the date/time is correctly formatted for the backend (ISO 8601 string)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple validation check: Start time must be before end time.
        if (new Date(formData.start_time) >= new Date(formData.end_time)) {
             setError('Start time must be before end time.');
             setLoading(false);
             return;
        }

        try {
            // The formData fields (start_time, end_time) are already ISO strings from the datetime-local input
            await createEvent(formData); 
            
            // 🚨 SUCCESS ACTION: Redirect directly to the main calendar view
            navigate('/events'); 

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create event. Check ownership/auth.';
            setError(message);
            console.error("Event creation error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-6 border-b border-purple-700 pb-2">
                        + Create New Event
                    </h1>

                    <div className="bg-[#3A1869] p-8 rounded-xl shadow-2xl">
                        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            
                            {/* Row 1: Title and Category */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white"
                                    placeholder="e.g., Hackathon, Career Fair"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                <select name="category" value={formData.category} onChange={handleInputChange} required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Row 2: Date and Time */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                                <input
                                    type="datetime-local"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white"
                                />
                            </div>
                            
                            {/* Row 3: Audience and Capacity */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                                <select name="audience" value={formData.audience} onChange={handleInputChange} required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white">
                                    {AUDIENCES.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Capacity (0 for unlimited)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white"
                                />
                            </div>
                            
                            {/* Row 4: Mode and Location */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Event Mode</label>
                                <select name="event_mode" value={formData.event_mode} onChange={handleInputChange} required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white">
                                    {MODES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1).replace(/_/g, ' ')}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Location/Link</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Online Link or Room 404"
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white"
                                />
                            </div>

                            {/* Row 5: Description (Full Width) */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-[#2a0e4d] border-gray-600 text-white"
                                    placeholder="Detailed description of the event, speakers, etc."
                                />
                            </div>

                            {/* Row 6: Actions */}
                            <div className="col-span-2 flex justify-end space-x-4 pt-4 border-t border-purple-700">
                                <button 
                                    type="button"
                                    onClick={() => navigate('/events')}
                                    className="px-6 py-2 border border-gray-400 text-gray-300 rounded-lg hover:bg-gray-600 transition font-semibold"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-purple-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Schedule Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default withSidebarToggle(CreateEventForm);