const User = require('../models/user.model');
const { validationResult } = require('express-validator'); // Import validationResult for registration
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User Registration
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword); // Log hashed password

        // Create new user
        user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
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
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log('Password validation:', isPasswordValid);

    if (!isPasswordValid) {
        console.log('Invalid credentials: Password does not match.');
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If user is found and password is valid, generate token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

// User Logout
exports.logout = (req, res) => {
    res.json({ message: 'Logout successful' });
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

        // Find the user by ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's role
        user.role = role;
        await user.save();

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};