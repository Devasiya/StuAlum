// BACKEND/controllers/forumController.js (UPDATED)

const Post = require('../models/Post');
const PostComment = require('../models/PostComment');
const PostLike = require('../models/PostLike');
const PostReport = require('../models/PostReport');
const ForumCategory = require('../models/ForumCategory');

// --- Helper function to determine the Mongoose model name based on role ---
const getProfileType = (role) => (role === 'student' ? 'StudentProfile' : 'AlumniProfile');

// --- Helper function to verify post ownership ---
const verifyPostOwnership = async (postId, userId, res) => {
    const post = await Post.findById(postId).select('created_by');
    if (!post) {
        res.status(404).json({ message: 'Post not found.' });
        return false;
    }
    // Compare the post's creator ID (Mongoose ObjectId) with the authenticated user ID (String)
    if (post.created_by.toString() !== userId) {
        res.status(403).json({ message: 'Unauthorized. You do not own this post.' });
        return false;
    }
    return post;
};

// ===================================================
// 1. CONTENT RETRIEVAL (GET) HANDLERS
// ===================================================

// GET /api/forums/categories
exports.getCategories = async (req, res) => {
    try {
        console.log('Mongoose Model Check:', ForumCategory.modelName); 
        
        const categories = await ForumCategory.find().lean();
        console.log('Categories Fetched:', categories.length); 
        res.json(categories);
    } catch (error) {
        console.error('CRITICAL ERROR fetching categories:', error.message);
        res.status(500).json({ message: 'Error fetching categories.' });
    }
};

// GET /api/forums/posts
exports.getPosts = async (req, res) => {
    try {
        const { category, sort = 'latest', limit = 10, skip = 0 } = req.query;
        let query = {};
        let sortOptions = { created_at: -1 };

        if (category) query.forum_id = category;
        if (sort === 'popular') sortOptions = { likes_count: -1, created_at: -1 };

        const posts = await Post.find(query)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate({ path: 'created_by', select: 'full_name' }) 
            .populate({ path: 'forum_id', select: 'title' })
            .select('-content')
            .lean();

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts.' });
    }
};

// GET /api/forums/posts/:postId
exports.getPostDetail = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate('created_by', 'full_name') 
            .populate('forum_id', 'title')
            .lean();

        if (!post) return res.status(404).json({ message: 'Post not found.' });

        Post.updateOne({ _id: req.params.postId }, { $inc: { views_count: 1 } }).exec();
        
        const comments = await PostComment.find({ post_id: req.params.postId })
            .populate('created_by', 'full_name')
            .sort({ created_at: 1 })
            .lean();

        res.json({ post, comments });
    } catch (error) {
        console.error('Error fetching post detail:', error);
        res.status(500).json({ message: 'Error fetching post detail.' });
    }
};

// GET /api/forums/posts/:postId/comments 
exports.getPostComments = async (req, res) => {
    res.status(501).json({ message: 'Function to get paginated comments not yet fully implemented.' });
};


// ===================================================
// 2. USER INTERACTION (POST/PUT/DELETE) HANDLERS
// ===================================================

// POST /api/forums/posts
exports.createPost = async (req, res) => {
    try {
        const { id: created_by, role } = req.user; 
        const author_model_type = getProfileType(role);

        const newPost = new Post({
            ...req.body,
            created_by,
            author_model_type,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post.' });
    }
};

// POST /api/forums/comments
exports.createComment = async (req, res) => {
    res.status(501).json({ message: 'Function to create comment not yet implemented.' });
};

// POST /api/forums/likes
exports.toggleLike = async (req, res) => {
    res.status(501).json({ message: 'Function to toggle like not yet implemented.' });
};

// POST /api/forums/report
exports.reportContent = async (req, res) => {
    res.status(501).json({ message: 'Function to report content not yet implemented.' });
};

// PUT /api/forums/posts/:postId
// 🚨 IMPLEMENTED: Update Post and verify ownership
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        // Authenticated User ID is available from the auth middleware on req.user
        const { id: userId } = req.user; 
        const { title, content, forum_id } = req.body;

        // 1. Verify ownership and existence
        const post = await verifyPostOwnership(postId, userId, res);
        if (!post) return; // Response handled by helper

        // 2. Update the post fields
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, forum_id, updated_at: Date.now() },
            { new: true } // Returns the updated document
        ).lean();

        res.json({ message: 'Post updated successfully.', post: updatedPost });

    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post.' });
    }
};

// DELETE /api/forums/posts/:postId
// 🚨 IMPLEMENTED: Delete Post and all related data, verifying ownership
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        // Authenticated User ID is available from the auth middleware on req.user
        const { id: userId } = req.user; 

        // 1. Verify ownership
        const post = await verifyPostOwnership(postId, userId, res);
        if (!post) return;

        // 2. Delete the post and all associated comments/likes/reports (Crucial for data integrity)
        await Post.deleteOne({ _id: postId });
        await PostComment.deleteMany({ post_id: postId });
        await PostLike.deleteMany({ target_id: postId, target_model_type: 'Post' });
        await PostReport.deleteMany({ target_id: postId, target_model_type: 'Post' });

        // 3. Success response
        res.json({ message: 'Post and all related data deleted successfully.' });

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post.' });
    }
};


// ===================================================
// 3. ADMIN/MODERATION HANDLERS
// ===================================================

// POST /api/admin/categories
exports.createCategory = async (req, res) => {
    res.status(501).json({ message: 'Admin function to create category not yet implemented.' });
};

// PUT /api/admin/posts/:postId/pin
exports.togglePin = async (req, res) => {
    res.status(501).json({ message: 'Admin function to toggle pin not yet implemented.' });
};

// DELETE /api/admin/posts/:postId
exports.adminDeletePost = async (req, res) => {
    res.status(501).json({ message: 'Admin function to delete post not yet implemented.' });
};

// GET /api/admin/reports
exports.getPendingReports = async (req, res) => {
    res.status(501).json({ message: 'Admin function to fetch reports not yet implemented.' });
};

// PUT /api/admin/reports/:reportId
exports.resolveReport = async (req, res) => {
    res.status(501).json({ message: 'Admin function to resolve report not yet implemented.' });
};