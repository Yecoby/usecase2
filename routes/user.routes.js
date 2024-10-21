const express = require('express');
const { login, updateUserRole } = require('../controllers/user.controller'); // Import the login function
const { validateRole } = require('../middlewares/validateRole'); // Ensure this line exists
const router = express.Router();

// User login route
router.post('/login', login); // Add this line for login functionality

// Update user role - accessible only to admin
router.put('/:userId/role', validateRole(['Admin']), updateUserRole);

module.exports = router;