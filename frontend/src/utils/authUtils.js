// frontend/src/utils/authUtils.js

export const getCurrentUserIdFromToken = () => {
    try {
        // FIX: The key is confirmed to be 'token' (lowercase)
        const token = localStorage.getItem('token'); 

        if (!token) return null;

        // Decode the Payload (the middle part of the JWT)
        const parts = token.split('.');
        if (parts.length !== 3) {
             console.error("AuthUtil: Invalid token format.");
             return null;
        }
        
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        // Return the User ID from the token payload.
        // The ID is often stored as 'id' or '_id'. We check both and convert to string.
        const userId = payload.id || payload._id || null; 
        
        // This should now return the correct ID string.
        return userId ? String(userId) : null; 
        
    } catch (e) {
        console.error("AuthUtil: Error during token decoding.", e);
        return null;
    }
};