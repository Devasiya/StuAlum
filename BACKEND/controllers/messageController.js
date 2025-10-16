const Conversation = require('../models/Conservation');
const ConversationParticipant = require('../models/ConversationParticipant');
const Message = require('../models/Message');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');
const AdminProfile = require('../models/AdminProfile');
const StudentProfile = require('../models/StudentProfile');

// Get all conversations for the logged-in user
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all conversations where the user is a participant
        const participants = await ConversationParticipant.find({ user_id: userId })
            .populate('conversation_id');

        const conversationsWithDetails = await Promise.all(
            participants.map(async (participant) => {
                const conversation = participant.conversation_id;

                // Find the other participant
                const otherParticipantDoc = await ConversationParticipant.findOne({
                    conversation_id: conversation._id,
                    user_id: { $ne: userId }
                }).populate('user_id');

                if (!otherParticipantDoc) return null;

                const otherUser = otherParticipantDoc.user_id;

                // Get profile based on role
                let profile = null;
                if (otherUser.role === 'alumni') {
                    profile = await AlumniProfile.findOne({ user_id: otherUser._id });
                } else if (otherUser.role === 'admin') {
                    profile = await AdminProfile.findOne({ user_id: otherUser._id });
                } else if (otherUser.role === 'student') {
                    profile = await StudentProfile.findOne({ user_id: otherUser._id });
                }

                // Get last message
                const lastMessage = await Message.findOne({ conversation_id: conversation._id })
                    .sort({ sent_at: -1 })
                    .populate('sender_id', 'full_name');

                return {
                    _id: conversation._id,
                    title: conversation.title,
                    otherParticipant: {
                        _id: otherUser._id,
                        full_name: profile?.full_name || otherUser.email,
                        email: otherUser.email,
                        role: otherUser.role,
                        profile_photo_url: profile?.profile_photo_url,
                        current_position: profile?.current_position,
                        company: profile?.company
                    },
                    lastMessage: lastMessage ? {
                        message_text: lastMessage.message_text,
                        sent_at: lastMessage.sent_at,
                        sender_id: lastMessage.sender_id
                    } : null,
                    created_at: conversation.created_at
                };
            })
        );

        // Filter out null conversations and sort by last message time
        const validConversations = conversationsWithDetails
            .filter(conv => conv !== null)
            .sort((a, b) => {
                if (!a.lastMessage && !b.lastMessage) return 0;
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return new Date(b.lastMessage.sent_at) - new Date(a.lastMessage.sent_at);
            });

        res.status(200).json(validConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server error while fetching conversations' });
    }
};

// Get messages for a specific conversation
exports.getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        // Verify user is participant in this conversation
        const isParticipant = await ConversationParticipant.findOne({
            conversation_id: conversationId,
            user_id: userId
        });

        if (!isParticipant) {
            return res.status(403).json({ message: 'Access denied to this conversation' });
        }

        // Get conversation details
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Get other participant details
        const otherParticipantDoc = await ConversationParticipant.findOne({
            conversation_id: conversationId,
            user_id: { $ne: userId }
        }).populate('user_id');

        let otherParticipant = null;
        if (otherParticipantDoc) {
            const otherUser = otherParticipantDoc.user_id;

            // Get profile based on role
            let profile = null;
            if (otherUser.role === 'alumni') {
                profile = await AlumniProfile.findOne({ user_id: otherUser._id });
            } else if (otherUser.role === 'admin') {
                profile = await AdminProfile.findOne({ user_id: otherUser._id });
            } else if (otherUser.role === 'student') {
                profile = await StudentProfile.findOne({ user_id: otherUser._id });
            }

            otherParticipant = {
                _id: otherUser._id,
                full_name: profile?.full_name || otherUser.email,
                email: otherUser.email,
                role: otherUser.role,
                profile_photo_url: profile?.profile_photo_url,
                current_position: profile?.current_position,
                company: profile?.company
            };
        }

        // Get messages
        const messages = await Message.find({ conversation_id: conversationId })
            .populate('sender_id', 'full_name email')
            .sort({ sent_at: 1 });

        res.status(200).json({
            conversation: {
                _id: conversation._id,
                title: conversation.title,
                otherParticipant
            },
            messages
        });
    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        res.status(500).json({ message: 'Server error while fetching messages' });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { conversation_id, message_text } = req.body;
        const senderId = req.user.id;

        if (!message_text || !message_text.trim()) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        // Verify user is participant in this conversation
        const isParticipant = await ConversationParticipant.findOne({
            conversation_id: conversation_id,
            user_id: senderId
        });

        if (!isParticipant) {
            return res.status(403).json({ message: 'Access denied to this conversation' });
        }

        // Create and save message
        const newMessage = new Message({
            conversation_id,
            sender_id: senderId,
            message_text: message_text.trim()
        });

        await newMessage.save();

        // Populate sender info for response
        await newMessage.populate('sender_id', 'full_name email');

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error while sending message' });
    }
};

// Create or get conversation between two users
exports.createOrGetConversation = async (req, res) => {
    try {
        const { otherUserId } = req.body;
        const currentUserId = req.user.id;

        if (!otherUserId) {
            return res.status(400).json({ message: 'Other user ID is required' });
        }

        // Check if conversation already exists between these two users
        const existingParticipants = await ConversationParticipant.find({
            user_id: { $in: [currentUserId, otherUserId] }
        }).populate('conversation_id');

        // Group by conversation
        const conversationMap = {};
        existingParticipants.forEach(participant => {
            const convId = participant.conversation_id._id.toString();
            if (!conversationMap[convId]) {
                conversationMap[convId] = [];
            }
            conversationMap[convId].push(participant);
        });

        // Find conversation with exactly 2 participants (both users)
        let existingConversation = null;
        for (const [convId, participants] of Object.entries(conversationMap)) {
            if (participants.length === 2) {
                const userIds = participants.map(p => p.user_id.toString());
                if (userIds.includes(currentUserId) && userIds.includes(otherUserId)) {
                    existingConversation = participants[0].conversation_id;
                    break;
                }
            }
        }

        if (existingConversation) {
            return res.status(200).json({ conversation: existingConversation });
        }

        // Create new conversation
        const newConversation = new Conversation({
            title: null // No title for 1-on-1 conversations
        });

        await newConversation.save();

        // Add participants
        const participants = [
            new ConversationParticipant({
                conversation_id: newConversation._id,
                user_id: currentUserId
            }),
            new ConversationParticipant({
                conversation_id: newConversation._id,
                user_id: otherUserId
            })
        ];

        await ConversationParticipant.insertMany(participants);

        res.status(201).json({ conversation: newConversation });
    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        res.status(500).json({ message: 'Server error while creating conversation' });
    }
};
