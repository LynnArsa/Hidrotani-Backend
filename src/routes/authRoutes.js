const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.login);

// PROTECTED
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: "Protected profile route", user: req.user });
});

router.put('/profile', authenticateToken, AuthController.updateUserProfile);


module.exports = router;
