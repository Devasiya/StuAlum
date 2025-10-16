import React, { useState, useEffect, useRef } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

import { getCurrentUserIdFromToken } from '../utils/authUtils';



const API_BASE_URL = 'http://localhost:5000';



const Messages = () => {

    const { conversationId } = useParams();

    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);

    const [currentConversation, setCurrentConversation] = useState(null);

    const [messages, setMessages] = useState([]);

    const [newMessage, setNewMessage] = useState('');

    const [loading, setLoading] = useState(true);

    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef(null);



    const currentUserId = getCurrentUserIdFromToken();



    // Scroll to bottom when new messages arrive

    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    };



    useEffect(() => {

        scrollToBottom();

    }, [messages]);



    // Fetch user's conversations

    useEffect(() => {

        const fetchConversations = async () => {

            try {

                const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {

                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

                });

                setConversations(response.data);

            } catch (error) {

                console.error('Error fetching conversations:', error);

            }

        };



        if (currentUserId) {

            fetchConversations();

        }

    }, [currentUserId]);



    // Fetch messages for current conversation

    useEffect(() => {

        const fetchMessages = async () => {

            if (!conversationId) return;



            setLoading(true);

            try {

                const response = await axios.get(`${API_BASE_URL}/api/messages/conversation/${conversationId}`, {

                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

                });

                setMessages(response.data.messages);

                setCurrentConversation(response.data.conversation);

            } catch (error) {

                console.error('Error fetching messages:', error);

            } finally {

                setLoading(false);

            }

        };



        fetchMessages();

    }, [conversationId]);



    const handleSendMessage = async (e) => {

        e.preventDefault();

        if (!newMessage.trim() || !conversationId) return;



        setSending(true);

        try {

            const response = await axios.post(`${API_BASE_URL}/api/messages/send`, {

                conversation_id: conversationId,

                message_text: newMessage.trim()

            }, {

                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

            });



            setMessages(prev => [...prev, response.data]);

            setNewMessage('');

        } catch (error) {

            console.error('Error sending message:', error);

            alert('Failed to send message. Please try again.');

        } finally {

            setSending(false);

        }

    };



    const formatTime = (dateString) => {

        const date = new Date(dateString);

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    };



    return (

        <div className="messages-page flex h-screen bg-gray-50">

            {/* Conversations Sidebar */}

            <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">

                <div className="p-4 border-b border-gray-200">

                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>

                </div>

                <div className="flex-1 overflow-y-auto">

                    {conversations.map(conversation => (

                        <div

                            key={conversation._id}

                            onClick={() => navigate(`/messages/${conversation._id}`)}

                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${

                                conversation._id === conversationId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''

                            }`}

                        >

                            <div className="flex items-center space-x-3">

                                <img

                                    src={conversation.otherParticipant?.profile_photo_url

                                        ? `${API_BASE_URL}${conversation.otherParticipant.profile_photo_url}`

                                        : '/default-avatar.png'}

                                    alt={conversation.otherParticipant?.full_name}

                                    className="w-10 h-10 rounded-full object-cover"

                                />

                                <div className="flex-1 min-w-0">

                                    <p className="font-semibold text-gray-900 truncate">

                                        {conversation.otherParticipant?.full_name}

                                    </p>

                                    <p className="text-sm text-gray-500 truncate">

                                        {conversation.lastMessage?.message_text || 'No messages yet'}

                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                    {conversations.length === 0 && (

                        <div className="p-8 text-center text-gray-500">

                            No conversations yet. Start messaging with alumni!

                        </div>

                    )}

                </div>

            </div>



            {/* Messages Area */}

            <div className="flex-1 flex flex-col">

                {conversationId ? (

                    <>

                        {/* Chat Header */}

                        <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-3">

                            <img

                                src={currentConversation?.otherParticipant?.profile_photo_url

                                    ? `${API_BASE_URL}${currentConversation.otherParticipant.profile_photo_url}`

                                    : '/default-avatar.png'}

                                alt={currentConversation?.otherParticipant?.full_name}

                                className="w-10 h-10 rounded-full object-cover"

                            />

                            <div>

                                <h3 className="font-semibold text-gray-900">

                                    {currentConversation?.otherParticipant?.full_name}

                                </h3>

                                <p className="text-sm text-gray-500">

                                    {currentConversation?.otherParticipant?.current_position} at {currentConversation?.otherParticipant?.company}

                                </p>

                            </div>

                        </div>



                        {/* Messages List */}

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">

                            {loading ? (

                                <div className="text-center text-gray-500">Loading messages...</div>

                            ) : messages.length === 0 ? (

                                <div className="text-center text-gray-500">

                                    No messages yet. Start the conversation!

                                </div>

                            ) : (

                                messages.map(message => (

                                    <div

                                        key={message._id}

                                        className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}

                                    >

                                        <div

                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${

                                                message.sender_id === currentUserId

                                                    ? 'bg-blue-500 text-white'

                                                    : 'bg-gray-200 text-gray-800'

                                            }`}

                                        >

                                            <p className="text-sm">{message.message_text}</p>

                                            <p className={`text-xs mt-1 ${

                                                message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'

                                            }`}>

                                                {formatTime(message.sent_at)}

                                            </p>

                                        </div>

                                    </div>

                                ))

                            )}

                            <div ref={messagesEndRef} />

                        </div>



                        {/* Message Input */}

                        <div className="bg-white border-t border-gray-200 p-4">

                            <form onSubmit={handleSendMessage} className="flex space-x-2">

                                <input

                                    type="text"

                                    value={newMessage}

                                    onChange={(e) => setNewMessage(e.target.value)}

                                    placeholder="Type your message..."

                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                    disabled={sending}

                                />

                                <button

                                    type="submit"

                                    disabled={sending || !newMessage.trim()}

                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"

                                >

                                    {sending ? 'Sending...' : 'Send'}

                                </button>

                            </form>

                        </div>

                    </>

                ) : (

                    <div className="flex-1 flex items-center justify-center bg-gray-50">

                        <div className="text-center">

                            <i className="fas fa-comments text-6xl text-gray-300 mb-4"></i>

                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>

                            <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};



export default Messages;

