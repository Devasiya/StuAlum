// frontend/src/services/forumService.js

import api from './api'; 

export const getForumCategories = () => api.get('/forums/categories');
export const getPostsList = (params) => api.get('/forums/posts', { params });
export const getPostDetail = (postId) => api.get(`/forums/posts/${postId}`);
export const createPost = (postData) => api.post('/forums/posts', postData);
export const toggleLike = (targetId, targetType) => api.post('/forums/likes', {
    target_id: targetId,
    target_model_type: targetType,
});
// ... other API calls ...

// PUT /api/forums/posts/:postId
export const updatePost = (postId, updateData) => api.put(`/forums/posts/${postId}`, updateData);

// DELETE /api/forums/posts/:postId
export const deletePost = (postId) => api.delete(`/forums/posts/${postId}`);

// POST /api/forums/comments
export const createComment = (commentData) => {
    return api.post('/forums/comments', commentData);
};

// DELETE /api/forums/comments/:commentId
export const deleteComment = (commentId) => api.delete(`/forums/comments/${commentId}`);

export const reportContent = (reportData) => {
    return api.post('/forums/report', reportData);
};

// 🚨 ADMIN REPORTING FUNCTIONS (FINAL FIXED PATHS)

// 1. GET /api/forums/admin/reports (Successfully loads the dashboard)
export const getPendingReports = () => {
    // Correctly nested path
    return api.get('forums/admin/reports'); 
};

// 2. PUT /api/admin/reports/:reportId
export const resolveReport = (reportId, status) => {
    // 🚨 FIX: Must include 'forums/admin' to match the correct server route mounting.
    return api.put(`forums/admin/reports/${reportId}`, { status });
};