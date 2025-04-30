const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole
} = require('../controllers/usersController');
const {
  authenticateJWT,
  authorizeRole
} = require('../middlewares/authMiddleware');
const authorizeSelfOrAdmin = require('../middlewares/canEditMiddleware.js'); 

const router = express.Router();

// Only admins can see all users
router.get('/', authenticateJWT, authorizeRole(['admin']), getUsers);

// Only the user themselves or admin can view a user
router.get('/:id', authenticateJWT, authorizeSelfOrAdmin, getUserById);

// Only the user themselves or admin can update user data
router.put('/:id', authenticateJWT, authorizeSelfOrAdmin, updateUser);

// Only admins can delete a user
router.delete('/:id', authenticateJWT, authorizeRole(['admin']), deleteUser);

// Only admins can change user roles
router.patch('/:id/role', authenticateJWT, authorizeRole(['admin']), changeUserRole);

module.exports = router;
