// BACKEND/middleware/auth.js (TEMPORARY FIX TO PREVENT HANGING)
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; 

// CRITICAL FIX: Made async to avoid process blocking, even if DB lookup is skipped.
const auth = async (req, res, next) => {
    // 1. Get token from header
    const token = req.header('x-auth-token'); 

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        // 2. Verify token (Synchronous operation)
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded.id || !decoded.role) {
            return res.status(401).json({ message: 'Token payload is corrupted or missing essential user data (id or role).' });
        }
        
        // 🚨 TEMPORARY: Attach user data from token payload without a DB lookup.
        // This bypasses the query that is causing the hang.
        req.user = {
            id: decoded.id,
            role: decoded.role.toLowerCase() 
        };

        // 3. Pass control to the next middleware (checkRole) or controller
        next();
        
    } catch (e) {
        console.error('Token validation error:', e.message);
        res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
};

module.exports = auth;