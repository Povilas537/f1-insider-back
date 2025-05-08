const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  subscribeToNewsletter

} = require('../controllers/usersController');
const {
  authenticateJWT,
  authorizeRole
} = require('../middlewares/authMiddleware');
const authorizeSelfOrAdmin = require('../middlewares/canEditMiddleware.js'); 

const router = express.Router();


router.get('/', authenticateJWT, authorizeRole(['admin']), getUsers);


router.get('/:id', authenticateJWT, authorizeSelfOrAdmin, getUserById);


router.put('/:id', authenticateJWT, authorizeSelfOrAdmin, updateUser);


router.delete('/:id', authenticateJWT, authorizeRole(['admin']), deleteUser);


router.patch('/:id/role', authenticateJWT, authorizeRole(['admin']), changeUserRole);

router.post('/subscribe', authenticateJWT, subscribeToNewsletter);

module.exports = router;
