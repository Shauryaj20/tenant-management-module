const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all property routes by running the authMiddleware first
router.use(authMiddleware);

// Define endpoints
router.post('/', propertyController.createProperty); // POST /properties
router.get('/', propertyController.getProperties);   // GET /properties

module.exports = router;