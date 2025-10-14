// BACKEND/controllers/forumController.js (CORRECTED)

const Post = require('../models/Post');
const PostComment = require('../models/PostComment');
const PostLike = require('../models/PostLike');
const PostReport = require('../models/PostReport');
const ForumCategory = require('../models/ForumCategory');

// --- Helper function to determine the Mongoose model name based on role ---
const getProfileType = (role) => (role === 'student' ? 'StudentProfile' : 'AlumniProfile');

// ===================================================
// 1. CONTENT RETRIEVAL (GET) HANDLERS
// ===================================================

// GET /api/forums/categories
exports.getCategories = async (req, res) => {
    try {
        // Log the model name to verify Mongoose is ready
        console.log('Mongoose Model Check:', ForumCategory.modelName); 
        
        const categories = await ForumCategory.find().lean();
        console.log('Categories Fetched:', categories.length); // Log the count
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
            
            // CRITICAL FIX 1: Changed 'select: name' to 'select: full_name'
            .populate({
                path: 'created_by',
                select: 'full_name' // <-- CORRECTED FIELD NAME
            }) 
            
            // FIX 2: Populate the Category Title
            .populate({
                path: 'forum_id',
                select: 'title'
            })
            
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
            // CRITICAL FIX 3: Changed 'name' to 'full_name'
            .populate('created_by', 'full_name') 
            .populate('forum_id', 'title')
            .lean();

        if (!post) return res.status(404).json({ message: 'Post not found.' });

        Post.updateOne({ _id: req.params.postId }, { $inc: { views_count: 1 } }).exec();
        
        const comments = await PostComment.find({ post_id: req.params.postId })
            // CRITICAL FIX 4: Changed 'name' to 'full_name'
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
exports.updatePost = async (req, res) => {
    res.status(501).json({ message: 'Function to update post not yet implemented.' });
};

// DELETE /api/forums/posts/:postId
exports.deletePost = async (req, res) => {
    res.status(501).json({ message: 'Function to delete post not yet implemented.' });
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