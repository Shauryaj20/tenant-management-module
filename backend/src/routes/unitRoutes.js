const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all unit routes
router.use(authMiddleware);

router.post('/', unitController.createUnit);
router.get('/', unitController.getUnits);

module.exports = router;