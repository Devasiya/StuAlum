// frontend/src/services/careerService.js (Placeholder)

import api from './api'; 

export const getPrepResources = (params) => {
    return Promise.resolve({ data: [] });
};

export const getArticlesAndVideos = (params) => {
    return Promise.resolve({ data: [] });
};

export const getQASessions = (params) => {
    return Promise.resolve({ data: [] });
};

// Upload Resume for AI Review

export const uploadResume = (formData) => {
    return api.post('/career/upload-resume', formData, {
        headers: {
            // 🚨 Explicitly set Content-Type header
            'Content-Type': 'multipart/form-data', 
        },
    }); 
};

export const createResource = (resourceData) => {
    // Hits the new Admin endpoint
    return api.post('/career/resource-create', resourceData);
};