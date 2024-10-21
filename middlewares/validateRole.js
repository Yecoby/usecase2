const jwt = require('jsonwebtoken');

// Middleware to validate user role
const validateRole = (roles) => {
    return (req, res, next) => {
        // Get token from the request headers
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token.' });
            }

            // Check if user role is authorized
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
            }

            // Attach user info to request object
            req.user = decoded;
            next();
        });
    };
};

module.exports = { validateRole };