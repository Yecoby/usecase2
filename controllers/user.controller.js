const { validationResult } = require('express-validator'); // Import validationResult for registration
const authService = require('../services/auth.service');

// User Registration
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
        const user = await authService.registerUser({ username, email, password, role });
        
        // Log the newly registered user
        console.log('User registered successfully:', {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Error during user registration:', err.message);
        res.status(500).send('Server error');
    }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
    const { userId } = req.params; // Get the user ID from the request parameters
    const { role } = req.body; // Get the new role from the request body

    try {
        // Check if the role is valid
        if (!['Admin', 'User'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Update the user's role using the service
        const updatedUser = await authService.updateUserRole(userId, role);

        res.json({ message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Attempting login with email:', email);

    try {
        const { token, user } = await authService.loginUser(email, password);
        
        res.json({ token, user });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(401).json({ message: 'Invalid credentials' });
    }
};