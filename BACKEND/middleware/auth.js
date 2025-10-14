// BACKEND/middleware/auth.js
const jwt = require('jsonwebtoken');

// CRITICAL FIX: Ensure the fallback key is ONLY used if process.env.JWT_SECRET is truly undefined,
// but for production, this fallback should be removed.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; 

const auth = (req, res, next) => {
    // 1. Get token from header
    const token = req.header('x-auth-token'); 

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // --- CRITICAL CORRECTION POINT ---
        // Validate that both essential fields (id and role) exist in the token payload.
        if (!decoded.id || !decoded.role) {
            return res.status(401).json({ 
                message: 'Token payload is corrupted or missing essential user data (id or role).' 
            });
        }
        
        // 4. Attach user data to request object
        req.user = {
            id: decoded.id,
            // FIX: Use a safeguard (optional chaining/check) before using toLowerCase(). 
            // Although the 'if' block above prevents the crash, this is a clean defensive measure.
            role: decoded.role.toLowerCase() 
        };

        next();
    } catch (e) {
        console.error('Token validation error:', e.message);
        // Returns 401 for signature errors or expired tokens
        res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
};

module.exports = auth;