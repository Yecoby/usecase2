const express = require('express');
const {
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
    assignUserToBranch,
} = require('../controllers/branch.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(restrictTo('Admin'), getAllBranches)
    .post(restrictTo('Admin'), createBranch);

router.route('/:branchId')
    .get(restrictTo('Admin', 'User'), getBranchById)
    .put(restrictTo('Admin'), updateBranch)
    .delete(restrictTo('Admin'), deleteBranch);

router.post('/:branchId/assign/:userId', restrictTo('Admin'), assignUserToBranch);

module.exports = router;