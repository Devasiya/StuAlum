// middleware/checkRole.js

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Assume req.user = { id: '...', role: 'student' } is set by auth.js
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        const userRole = req.user.role.toLowerCase();
        
        if (allowedRoles.includes(userRole)) {
            next(); // User has the necessary permission
        } else {
            res.status(403).json({ 
                message: `Access denied. Role '${userRole}' is not authorized for this action.` 
            });
        }
    };
};

module.exports = { checkRole };