const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all unit routes
router.use(authMiddleware);

router.post('/', unitController.createUnit);
router.get('/', unitController.getUnits);
router.delete('/:id', unitController.deleteUnit);
router.put('/:id', unitController.updateUnit);

module.exports = router;