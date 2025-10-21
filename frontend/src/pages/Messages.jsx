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
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyTo, setReplyTo] = useState(null);

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

            // Skip if this is a mentorship conversation ID (not a real conversation)
            if (conversationId.startsWith('mentorship-')) return;

            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/messages/conversation/${conversationId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                setMessages(response.data.messages);
                setCurrentConversation(response.data.conversation);

                // Refresh conversations to update unread counts after viewing messages
                const conversationsResponse = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setConversations(conversationsResponse.data);
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

        // Skip if this is a mentorship conversation ID (not a real conversation)
        if (conversationId.startsWith('mentorship-')) return;

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

            // Refresh conversations to update last message and unread counts
            const conversationsResponse = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setConversations(conversationsResponse.data);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleEditMessage = async (messageId, newText) => {
        if (!newText.trim()) return;

        try {
            const response = await axios.put(`${API_BASE_URL}/api/messages/${messageId}`, {
                message_text: newText.trim()
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            setMessages(prev => prev.map(msg =>
                msg._id === messageId ? response.data : msg
            ));

            setEditingMessageId(null);
            setEditingText('');
        } catch (error) {
            console.error('Error editing message:', error);
            alert('Failed to edit message. Please try again.');
        }
    };

    const handleDeleteMessage = async (messageId, isCurrentUser) => {
        const confirmMessage = isCurrentUser
            ? 'Are you sure you want to delete this message for everyone?'
            : 'Are you sure you want to delete this message for yourself?';

        if (!window.confirm(confirmMessage)) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/messages/${messageId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (isCurrentUser) {
                // For sent messages, mark as deleted in UI
                setMessages(prev => prev.map(msg =>
                    msg._id === messageId ? { ...msg, is_deleted: true } : msg
                ));
            } else {
                // For received messages deleted for self, remove from UI
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message. Please try again.');
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Handle long press for context menu (removed as per plan)

    // Handle context menu actions
    const handleReply = () => {
        setReplyTo(selectedMessage);
        setShowContextMenu(false);
    };

    const handleForward = () => {
        // For now, just copy to clipboard
        navigator.clipboard.writeText(selectedMessage.message_text);
        alert('Message copied to clipboard');
        setShowContextMenu(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedMessage.message_text);
        alert('Message copied to clipboard');
        setShowContextMenu(false);
    };

    const handleEdit = () => {
        setEditingMessageId(selectedMessage._id);
        setEditingText(selectedMessage.message_text);
        setShowContextMenu(false);
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowContextMenu(false);
        };
        if (showContextMenu) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showContextMenu]);

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
                            onClick={() => {
                                if (conversation.isMentorship) {
                                    // For mentorship conversations, create or get real conversation first
                                    const otherUserId = conversation.otherParticipant._id;
                                    axios.post(`${API_BASE_URL}/api/messages/conversation`, {
                                        otherUserId: otherUserId
                                    }, {
                                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                                    }).then(response => {
                                        navigate(`/messages/${response.data.conversation._id}`);
                                    }).catch(error => {
                                        console.error('Error creating mentorship conversation:', error);
                                        alert('Failed to start mentorship conversation. Please try again.');
                                    });
                                } else {
                                    navigate(`/messages/${conversation._id}`);
                                }
                            }}
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
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {conversation.otherParticipant?.full_name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conversation.lastMessage?.message_text || 'No messages yet'}
                                            </p>
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                                                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                                            </div>
                                        )}
                                    </div>
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
                            {conversationId.startsWith('mentorship-') ? (
                                <div className="text-center text-gray-500">
                                    <i className="fas fa-handshake text-6xl text-gray-300 mb-4"></i>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Mentorship Conversation</h3>
                                    <p className="text-gray-500">Send your first message to start the mentorship conversation!</p>
                                </div>
                            ) : loading ? (
                                <div className="text-center text-gray-500">Loading messages...</div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-gray-500">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messages.map(message => {
                                    const senderId = message.sender_id?._id || message.sender_id;
                                    const isCurrentUser = senderId && senderId.toString() === currentUserId;
                                    return (
                                        <div
                                            key={message._id}
                                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className="flex flex-col">
                                                {/* Sender Name */}
                                                <p className={`text-xs mb-1 px-2 ${isCurrentUser ? 'text-right text-gray-600' : 'text-left text-gray-600'}`}>
                                                    {isCurrentUser ? 'You' : message.sender_name || message.sender_id?.full_name || message.sender_id?.email || 'Unknown User'}
                                                </p>
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
                                                        isCurrentUser
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-800'
                                                    }`}
                                                >
                                                    {editingMessageId === message._id ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={editingText}
                                                                onChange={(e) => setEditingText(e.target.value)}
                                                                className="w-full px-2 py-1 text-sm border rounded"
                                                                autoFocus
                                                            />
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleEditMessage(message._id, editingText)}
                                                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingMessageId(null);
                                                                        setEditingText('');
                                                                    }}
                                                                    className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm">
                                                                {message.is_deleted ? (
                                                                    <span className="italic text-gray-500">This message was deleted</span>
                                                                ) : (
                                                                    message.message_text
                                                                )}
                                                            </p>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <p className={`text-xs ${
                                                                    isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                                                                }`}>
                                                                    {formatTime(message.sent_at)}
                                                                    {message.edited_at && ' (edited)'}
                                                                </p>
                                                                {!message.is_deleted && (
                                                                    <div className="flex items-center space-x-1 relative">
                                                                        <div
                                                                            className="relative"
                                                                            onMouseEnter={(e) => {
                                                                                setSelectedMessage(message);
                                                                                setContextMenuPosition({ x: e.clientX, y: e.clientY });
                                                                                setShowContextMenu(true);
                                                                            }}
                                                                            onMouseLeave={() => {
                                                                                // Delay hiding to allow moving to menu
                                                                                setTimeout(() => setShowContextMenu(false), 100);
                                                                            }}
                                                                        >
                                                                            <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                                                                                ^
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Context Menu */}
                        {showContextMenu && selectedMessage && (
                            <div
                                className="fixed bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                                style={{
                                    left: contextMenuPosition.x,
                                    top: contextMenuPosition.y,
                                    transform: 'translate(-50%, -100%)'
                                }}
                                onMouseEnter={() => setShowContextMenu(true)}
                                onMouseLeave={() => setShowContextMenu(false)}
                            >
                                <div className="py-2">
                                    <button
                                        onClick={handleReply}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Reply
                                    </button>
                                    <button
                                        onClick={handleForward}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Forward
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Copy
                                    </button>
                                    {selectedMessage.sender_id?._id === currentUserId && (
                                        <button
                                            onClick={handleEdit}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            const isCurrentUser = selectedMessage.sender_id?._id === currentUserId;
                                            handleDeleteMessage(selectedMessage._id, isCurrentUser);
                                            setShowContextMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                                    >
                                        {selectedMessage.sender_id?._id === currentUserId ? 'Delete for Everyone' : 'Delete for Me'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Reply Indicator */}
                        {replyTo && (
                            <div className="bg-gray-100 border-l-4 border-blue-500 p-3 flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-700">
                                        Replying to {replyTo.sender_id?._id === currentUserId ? 'yourself' : currentConversation?.otherParticipant?.full_name}
                                    </p>
                                    <p className="text-sm text-gray-600 truncate">{replyTo.message_text}</p>
                                </div>
                                <button
                                    onClick={() => setReplyTo(null)}
                                    className="text-gray-500 hover:text-gray-700 ml-2"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

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
