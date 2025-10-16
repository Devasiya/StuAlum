import React, { useState } from 'react';

const InviteModal = ({ onClose, onSubmit }) => {
    const [emailList, setEmailList] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailList.trim()) {
            alert('Please enter at least one email address.');
            return;
        }
        setLoading(true);
        try {
            await onSubmit(emailList);
            setEmailList('');
            onClose();
        } catch (error) {
            console.error('Error sending invitations:', error);
            alert('Failed to send invitations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Invite Alumni</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter email addresses (comma-separated):
                    </label>
                    <textarea
                        value={emailList}
                        onChange={(e) => setEmailList(e.target.value)}
                        placeholder="e.g., john@example.com, jane@example.com"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        rows="4"
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Invitations'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteModal;
