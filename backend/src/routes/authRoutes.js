const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected route (Notice the authMiddleware injected in the middle)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;