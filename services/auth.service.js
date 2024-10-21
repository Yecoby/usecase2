const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (username, email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    return user;
};

exports.login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    const isPasswordValid = await user.validatePassword(password);
    return isPasswordValid ? user : null;
};