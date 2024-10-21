const Branch = require('../models/branch.model');

exports.getAllBranches = async (req, res) => {
    const branches = await Branch.findAll();
    res.json(branches);
};

exports.getBranchById = async (req, res) => {
    const { branchId } = req.params;
    const branch = await Branch.findByPk(branchId);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
};

exports.createBranch = async (req, res) => {
    const { name, location } = req.body;
    const newBranch = await Branch.create({ name, location });
    res.status(201).json(newBranch);
};

exports.updateBranch = async (req, res) => {
    const { branchId } = req.params;
    const { name, location, status } = req.body;
    const branch = await Branch.findByPk(branchId);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });

    branch.name = name;
    branch.location = location;
    branch.status = status;
    await branch.save();

    res.json(branch);
};

exports.deleteBranch = async (req, res) => {
    const { branchId } = req.params;
    const branch = await Branch.findByPk(branchId);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });

    await branch.destroy();
    res.json({ message: 'Branch deleted' });
};

exports.assignUserToBranch = async (req, res) => {
    // Assign a user to a branch logic
};