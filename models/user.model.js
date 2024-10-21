const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('Admin', 'User'), defaultValue: 'User' },
    });

    // Add a method to validate passwords
    User.prototype.validatePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    return User;
};