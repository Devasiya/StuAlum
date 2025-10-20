// frontend/src/components/Career/ResumeUploadModal.jsx

import React, { useState } from 'react';
// 🚨 NOTE: uploadResume must be updated in careerService.js to handle headers
import { uploadResume } from '../../services/careerService'; 

const ResumeUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF file only.');
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a resume (PDF) to upload.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            // The key 'resume' MUST match what's in Multer's .single('resume')
            formData.append('resume', file); 
            
            // 🚨 API call to upload the file
            // NOTE: The Content-Type: multipart/form-data header MUST be set in the service function (or the Axios instance)
            const res = await uploadResume(formData); 
            
            // On success, pass the generated review ID/URL to the parent component
            onUploadSuccess(res.data.reviewSessionId); 

        } catch (err) {
            console.error("Upload error:", err);
            // The message from the backend (e.g., 'No resume file provided.') is shown here
            setError(err.response?.data?.message || 'Failed to upload resume and start review.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="bg-[#3A1869] p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-purple-600 pb-2">
                    Upload Resume for AI Review
                </h2>
                
                <p className="text-gray-400 mb-6">Only PDF files are accepted. Maximum size: 5MB.</p>

                {error && <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">{error}</div>}
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select PDF File</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        disabled={loading}
                        // Added styling from previous step for file input
                        className="w-full text-white file:mr-4 file:py-2 file:px-4 
                                   file:rounded-full file:border-0 file:text-sm 
                                   file:bg-purple-700 file:text-white hover:file:bg-purple-800"
                    />
                    {file && <p className="text-sm text-green-400 mt-2">Selected: {file.name}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-6 py-2 text-gray-400 hover:text-white transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleUpload}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-500"
                        disabled={loading || !file}
                    >
                        {loading ? 'Processing...' : 'Start AI Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeUploadModal;