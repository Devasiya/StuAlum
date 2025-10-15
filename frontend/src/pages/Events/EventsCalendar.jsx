// frontend/src/pages/Events/EventsCalendar.jsx

import React, { useState, useEffect } from 'react';
import withSidebarToggle from '../../hocs/withSidebarToggle'; 
import Navbar from '../../components/Navbar'; 
import { useNavigate } from 'react-router-dom';
// Ensure deleteEvent is imported
import { getEventsList, registerForEvent, deleteEvent } from '../../services/eventService'; 
import { getCurrentUserIdFromToken } from '../../utils/authUtils'; // Utility for creator check

// --- Filter Options Data ---
const filterOptions = {
    category: ['All', 'Workshop', 'Networking', 'Career Fair', 'Meetup'],
    audience: ['all', 'students', 'alumni'],
    dateRange: ['All upcoming', 'This month', 'Next 30 days'],
    event_mode: ['All', 'in_person', 'virtual', 'hybrid'], 
};

const EventsCalendar = ({ onSidebarToggle }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        category: 'All',
        audience: 'all',
        dateRange: 'All upcoming', 
        location: 'All', 
    });
    
    const [appliedFilters, setAppliedFilters] = useState(filters);
    
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); 
    const navigate = useNavigate();
    const currentUserId = getCurrentUserIdFromToken(); 

    // --- Data Fetching Logic ---
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const apiFilters = {
                ...appliedFilters,
                event_mode: appliedFilters.location,
                location: undefined 
            };

            const res = await getEventsList(apiFilters);
            setEvents(res.data);
            
        } catch (error) {
            console.error("Failed to fetch events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [appliedFilters]); 

    // --- HANDLERS ---
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key === 'event_mode' ? 'location' : key]: value }));
    };

    const handleApply = () => {
        setAppliedFilters(filters);
    };
    
    const handleReset = () => {
        const defaultFilters = { category: 'All', audience: 'all', dateRange: 'All upcoming', location: 'All' };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters); 
    };

    const handleCreateEvent = () => {
        navigate('/events/new');
    };

    const handleToggleCalendar = () => {
        setIsCalendarOpen(prev => !prev);
    };
    
    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) return;
        
        try {
            await deleteEvent(eventId);
            alert('Event successfully deleted!');
            await fetchEvents(); 
            
        } catch (error) {
            const message = error.response?.data?.message || 'Deletion failed.';
            alert(message);
            console.error("Event deletion error:", error);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await registerForEvent(eventId);
            alert('Registration successful! You are now registered for this event.');
            fetchEvents(); 
            
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed.';
            alert(message);
            console.error("Registration error:", error);
        }
    };

    // Helper component for filter buttons
    const EventFilterPill = ({ label, options, selectedValue, onChange, filterKey }) => (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-400 mb-2">{label}</label>
            <div className="flex flex-wrap space-x-2">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`px-3 py-1 text-sm rounded-full transition 
                            ${filters[filterKey === 'event_mode' ? 'location' : filterKey] === option 
                                ? 'bg-purple-600 text-white font-bold' 
                                : 'bg-[#3A1869] text-gray-300 hover:bg-purple-700'
                            }`}
                    >
                        {option.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                ))}
            </div>
        </div>
    );
    
    // Renders a single event card for the Highlights section
    const HighlightCard = ({ event }) => {
        const isCreator = currentUserId && (String(currentUserId) === String(event.created_by));
        
        let actionButton;

        if (isCreator) {
            actionButton = (
                <button 
                    onClick={() => handleDeleteEvent(event._id || event.id)}
                    className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-700 font-medium"
                >
                    Delete
                </button>
            );
        } else {
            actionButton = (
                <button 
                    onClick={() => handleRegister(event._id || event.id)}
                    className="px-3 py-1 text-sm bg-purple-600 rounded hover:bg-purple-700 font-medium"
                >
                    Register
                </button>
            );
        }

        return (
            <div className="text-white bg-purple-900/50 p-4 rounded-lg shadow-md flex flex-col justify-between h-full">
                <div className="w-full h-32 bg-purple-800/70 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-300 text-sm">{event.category}</span>
                </div>

                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-xs text-gray-400">{event.description || `${event.event_mode.replace(/_/g, ' ')}`}</p> 
                
                <div className="flex justify-between text-sm mt-3 border-t border-purple-700 pt-3">
                    <span>🗓️ {new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>👥 {event.capacity} spots</span>
                </div>
                
                <div className="flex justify-between mt-3 items-center">
                    <button className="text-sm text-purple-300 hover:underline">Details</button>
                    {actionButton}
                </div>
            </div>
        );
    };


    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen relative">
                
                {/* MODAL BACKDROP (Transparent) */}
                {isCalendarOpen && (
                    <div className="fixed inset-0 z-30" onClick={handleToggleCalendar}></div>
                )}
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Events / Calendar</h1>
                    <div className="flex space-x-4">
                        <button 
                            onClick={handleCreateEvent}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center"
                        >
                            <span className="text-xl mr-2">+</span> Create Event
                        </button>
                        <button 
                            onClick={handleToggleCalendar}
                            className={`text-sm px-4 py-2 rounded-lg text-white font-semibold transition 
                                ${isCalendarOpen ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {isCalendarOpen ? 'Close Calendar' : 'View Calendar'}
                        </button>
                    </div>
                </div>

                {/* DISCOVER EVENTS PANEL (Always full width) */}
                <div className="w-full max-w-7xl mx-auto space-y-6"> 
                    
                    <h2 className="text-xl font-bold text-white border-b border-purple-700 pb-2">Discover Events</h2>
                    
                    {/* Filter Pills UI */}
                    <div className="bg-[#3A1869] p-4 rounded-xl shadow-lg">
                        {Object.keys(filterOptions).map(key => (
                            <EventFilterPill
                                key={key}
                                filterKey={key}
                                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                options={filterOptions[key]}
                                selectedValue={filters[key === 'event_mode' ? 'location' : key]}
                                onChange={(value) => handleFilterChange(key === 'event_mode' ? 'location' : key, value)}
                            />
                        ))}
                        <div className="flex space-x-3 mt-4">
                            <button 
                                onClick={handleReset}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Reset
                            </button>
                            <button 
                                onClick={handleApply}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                disabled={loading}
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Highlights (2-Column Grid) */}
                    <h2 className="text-xl font-bold text-white border-b border-purple-700 pb-2">Upcoming Highlights</h2>
                    <div className="bg-[#3A1869] p-4 rounded-xl shadow-lg">
                        {loading ? (
                            <p className="text-center text-gray-400 p-4">Loading upcoming highlights...</p>
                        ) : events.length === 0 ? (
                            <p className="text-center text-gray-400 p-4">No events found matching current filters.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
                                {/* Renders all events */}
                                {events.map(event => ( 
                                    <HighlightCard key={event._id || event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* CALENDAR MODAL OVERLAY (Fixed Position, Slides In) */}
                <div 
                    className={`fixed top-0 right-0 h-full w-full max-w-lg z-40 bg-[#1A1D26] p-6 shadow-2xl overflow-y-auto 
                        transition-transform duration-500 ease-in-out
                        ${isCalendarOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                    style={{ paddingTop: '80px' }} 
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Calendar View</h2>
                    
                    {loading ? (
                        <div className="text-center p-10 text-purple-300 bg-[#3A1869] rounded-xl">Loading Calendar...</div>
                    ) : (
                        // Placeholder for the Calendar Grid logic (can be expanded later)
                        <div className="grid grid-cols-7 gap-px bg-gray-700 border border-gray-700 rounded-xl overflow-hidden">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-center py-2 bg-[#3A1869] text-purple-300 font-semibold text-sm">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div key={i} className="h-28 bg-[#2a0e4d] p-1 text-xs text-white border-t border-gray-700">
                                    <p className="text-gray-400 text-right">{i + 1}</p>
                                    {/* Event rendering logic placeholder */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </>
    );
};

export default withSidebarToggle(EventsCalendar);