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

const verifyCommentOwnership = async (commentId, userId, res) => {
    // Note: Assuming PostComment uses 'created_by' for the user ID
    const comment = await PostComment.findById(commentId).select('created_by post_id');
    if (!comment) {
        res.status(404).json({ message: 'Comment not found.' });
        return false;
    }
    // Compare the comment's creator ID with the authenticated user ID
    if (comment.created_by.toString() !== userId) {
        res.status(403).json({ message: 'Unauthorized. You do not own this comment.' });
        return false;
    }
    return comment;
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
        const { postId } = req.params;
        const userId = req.user ? req.user.id : null; 
        
        // 1. Fetch the post first
        const post = await Post.findById(postId)
            .populate('created_by', 'full_name') // Assuming this population is needed here
            .populate('forum_id', 'title')      // Assuming this population is needed here
            .lean();

        if (!post) return res.status(404).json({ message: 'Post not found.' });

        // 2. Fetch the comments IMMEDIATELY AFTER the post
        const comments = await PostComment.find({ post_id: postId })
            .populate('created_by', 'full_name') // Assuming this population is needed here
            .sort({ created_at: 1 })
            .lean();
        
        // Update view count (should run concurrently, but fine here)
        Post.updateOne({ _id: postId }, { $inc: { views_count: 1 } }).exec();
        
        // 3. Check like status for post and comments (NOW 'comments' IS DEFINED)
        let userLikedPost = false;
        let likedComments = {}; // Map to store liked status for each comment

        if (userId) {
            // A. Check post like status
            const likedPost = await PostLike.findOne({ 
                target_id: postId, 
                target_model_type: 'Post',
                liker_profile_id: userId 
            });
            userLikedPost = !!likedPost;

            // B. Check comment like status
            const commentIds = comments.map(c => c._id); // NOW SAFE TO USE 'comments'
            const userLikedComments = await PostLike.find({
                target_id: { $in: commentIds },
                target_model_type: 'PostComment',
                liker_profile_id: userId
            }).select('target_id');

            userLikedComments.forEach(like => {
                likedComments[like.target_id.toString()] = true;
            });
        }
        
        // 4. Final response processing
        res.json({ 
            post: { ...post, userLiked: userLikedPost }, 
            comments: comments.map(c => ({ 
                ...c, 
                userLiked: !!likedComments[c._id.toString()] 
            })) 
        });
    } catch (error) {
        console.error('CRITICAL ERROR fetching post detail:', error);
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
    try {
        // Get user info from auth middleware
        const { id: created_by, role } = req.user; 
        const author_model_type = getProfileType(role);

        // Get post_id and content from request body (sent by frontend)
        const { post_id, content } = req.body; 

        if (!post_id || !content) {
            return res.status(400).json({ message: 'Post ID and content are required.' });
        }

        const newComment = new PostComment({
            post_id,
            content,
            created_by,
            author_model_type,
        });

        await newComment.save();
        
        // 🚨 CRITICAL: Increment the comment count on the parent post
        await Post.updateOne(
            { _id: post_id },
            { $inc: { comments_count: 1 } }
        ).exec();
        
        // Populate the author's name before sending the comment back
        const populatedComment = await PostComment.findById(newComment._id)
            .populate('created_by', 'full_name')
            .lean();

        // Send the complete, newly created comment back to the frontend
        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment.' });
    }
};

// DELETE /api/forums/comments/:commentId
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { id: userId } = req.user; // Authenticated User ID

        // 1. Verify ownership and existence
        const comment = await verifyCommentOwnership(commentId, userId, res);
        if (!comment) return; // Response handled by helper

        // Store post_id before deletion to update the count
        const postId = comment.post_id;

        // 2. Delete the comment and related likes/reports
        await PostComment.deleteOne({ _id: commentId });
        await PostLike.deleteMany({ target_id: commentId, target_model_type: 'PostComment' });
        await PostReport.deleteMany({ target_id: commentId, target_model_type: 'PostComment' });

        // 3. Decrement the comment count on the parent post
        await Post.updateOne(
            { _id: postId },
            { $inc: { comments_count: -1 } }
        ).exec();

        res.json({ message: 'Comment deleted successfully.' });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment.' });
    }
};


// POST /api/forums/likes
// IMPLEMENTED: Toggle Like functionality (like/unlike a Post or PostComment)
exports.toggleLike = async (req, res) => {
    try {
        // 1. Get user info and target info from request
        const { id: liker_profile_id, role: likerRole } = req.user; // Get user ID and role
        const liker_model_type = getProfileType(likerRole); // Helper converts role to 'StudentProfile'/'AlumniProfile'
        
        const { target_id, target_model_type } = req.body; // target_model_type: 'Post' or 'PostComment'

        if (!target_id || !target_model_type) {
            return res.status(400).json({ message: 'Target ID and type are required.' });
        }
        
        // 2. Define the query based on the provided PostLikeSchema fields
        const query = { liker_profile_id, target_id, target_model_type };

        // 3. Check if the like already exists
        const existingLike = await PostLike.findOne(query);
        let action; // 'liked' or 'unliked'

        if (existingLike) {
            // UNLIKE: If it exists, delete it
            await PostLike.deleteOne(query);
            action = 'unliked';
        } else {
            // LIKE: If it doesn't exist, create it
            const newLike = new PostLike({
                ...query, // Includes liker_profile_id, target_id, target_model_type
                liker_model_type // Add the necessary liker model type
            });
            await newLike.save();
            action = 'liked';
        }

        // 4. Update the likes_count on the target document
        let TargetModel;
        if (target_model_type === 'Post') {
            TargetModel = Post;
        } else if (target_model_type === 'PostComment') {
            TargetModel = PostComment;
        } else {
            return res.status(400).json({ message: 'Invalid target_model_type provided.' });
        }
        
        const increment = action === 'liked' ? 1 : -1;

        await TargetModel.updateOne(
            { _id: target_id },
            { $inc: { likes_count: increment } }
        ).exec();

        // Respond with the action taken and the net change
        res.json({ action, message: `Content ${action}.`, increment });

    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Error toggling like.' });
    }
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