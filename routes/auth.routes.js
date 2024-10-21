const express = require('express');
const { login, logout, register } = require('../controllers/auth.controller');
const { check } = require('express-validator'); // Import express-validator
const router = express.Router();

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// Registration route
router.post('/register', [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('role').isIn(['Admin', 'User']).withMessage('Role must be either Admin or User'), // Added missing comma here
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
], register); // Use the register function

module.exports = router;