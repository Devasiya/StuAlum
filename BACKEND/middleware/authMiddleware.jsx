// BACKEND/middleware/authMiddleware.js (Conceptual Code)

// This checks if the user is logged in AND if their role is 'admin'
exports.checkAdmin = (req, res, next) => {
    // Assuming 'req.user' object is populated by a preceding 'protect' middleware
    // and contains the user's role (e.g., req.user.role)
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to controller
    } else {
        res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
};