// frontend/src/pages/Career/AIChatInterface.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import withSidebarToggle from '../../hocs/withSidebarToggle'; 
import Navbar from '../../components/Navbar'; 

const AIChatInterface = ({ onSidebarToggle }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('sessionId');
    
    // In a real app, you would fetch the initial analysis and chat history using this sessionId
    
    return (
        <>
            <Navbar onSidebarToggle={onSidebarToggle} />
            <main className="flex-1 overflow-y-auto pt-[60px] px-10 py-5 bg-[#2a0e4d] min-h-screen">
                <div className="max-w-4xl mx-auto text-white">
                    <h1 className="text-3xl font-bold mb-4">AI Resume Review Session</h1>
                    <p className="text-purple-400 mb-6">Session ID: {sessionId || 'Loading...'}</p>

                    <div className="bg-[#3A1869] p-6 rounded-xl shadow-2xl h-[60vh] flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                            {/* Chat history will be mapped here */}
                            <p className="text-gray-300">AI: Welcome! I've completed the initial scan. How can I help you improve your resume?</p>
                        </div>
                        {/* Input for continuing the conversation */}
                        <div className="flex">
                            <input 
                                type="text" 
                                placeholder="Ask the AI a question about your resume..."
                                className="flex-1 px-4 py-2 rounded-l-lg bg-[#2a0e4d] border-gray-600 text-white"
                            />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg">Send</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default withSidebarToggle(AIChatInterface);