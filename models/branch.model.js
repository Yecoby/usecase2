const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('Branch', {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'deleted'), defaultValue: 'active' },
});

module.exports = Branch;