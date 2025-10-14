// frontend/src/services/forumService.js

import api from './api'; // Assume this is your configured Axios instance

export const getForumCategories = () => api.get('/forums/categories');
export const getPostsList = (params) => api.get('/forums/posts', { params });
export const getPostDetail = (postId) => api.get(`/forums/posts/${postId}`);
export const createPost = (postData) => api.post('/forums/posts', postData);
export const toggleLike = (targetId, targetType) => api.post('/forums/likes', {
    target_id: targetId,
    target_model_type: targetType,
});
// ... other API calls ...

// 🚨 NEW FUNCTIONS FOR CREATOR ACTIONS
// PUT /api/forums/posts/:postId
export const updatePost = (postId, updateData) => api.put(`/forums/posts/${postId}`, updateData);

// DELETE /api/forums/posts/:postId
export const deletePost = (postId) => api.delete(`/forums/posts/${postId}`);

// POST /api/forums/comments
export const createComment = (commentData) => {
    // commentData should contain { post_id, content }
    return api.post('/forums/comments', commentData);
};


// DELETE /api/forums/comments/:commentId
export const deleteComment = (commentId) => api.delete(`/forums/comments/${commentId}`);