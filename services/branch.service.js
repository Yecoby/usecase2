const { Branch } = require('../models/branch.model'); // Adjust the path as necessary
const { Op } = require('sequelize');

// Get all branches
exports.getAllBranches = async (filters) => {
    try {
        const branches = await Branch.findAll({
            where: {
                ...filters,
            },
        });
        return branches;
    } catch (error) {
        throw new Error('Error fetching branches: ' + error.message);
    }
};

// Get a branch by ID
exports.getBranchById = async (branchId) => {
    try {
        const branch = await Branch.findByPk(branchId);
        if (!branch) {
            throw new Error('Branch not found');
        }
        return branch;
    } catch (error) {
        throw new Error('Error fetching branch: ' + error.message);
    }
};

// Create a new branch
exports.createBranch = async (branchData) => {
    try {
        const newBranch = await Branch.create(branchData);
        return newBranch;
    } catch (error) {
        throw new Error('Error creating branch: ' + error.message);
    }
};

// Update a branch
exports.updateBranch = async (branchId, branchData) => {
    try {
        const branch = await this.getBranchById(branchId);
        await branch.update(branchData);
        return branch;
    } catch (error) {
        throw new Error('Error updating branch: ' + error.message);
    }
};

// Delete a branch
exports.deleteBranch = async (branchId) => {
    try {
        const branch = await this.getBranchById(branchId);
        await branch.destroy();
        return { message: 'Branch deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting branch: ' + error.message);
    }
};

// Search branches (optional)
exports.searchBranches = async (searchTerm) => {
    try {
        const branches = await Branch.findAll({
            where: {
                name: { [Op.like]: `%${searchTerm}%` }, // Adjust based on your model properties
            },
        });
        return branches;
    } catch (error) {
        throw new Error('Error searching branches: ' + error.message);
    }
};
