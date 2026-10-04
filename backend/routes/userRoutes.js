const express = require('express');
const { registerUser, createUser, listUsers, loginUser } = require('../controllers/userController');
const { requireAdmin, requireUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/users', requireAdmin, createUser);
router.get('/users', requireAdmin, listUsers);
router.get('/me', requireUser, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
