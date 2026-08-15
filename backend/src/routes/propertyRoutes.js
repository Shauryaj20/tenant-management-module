const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', propertyController.createProperty); // POST /properties
router.get('/', propertyController.getProperties);   // GET /properties
router.delete('/:id', propertyController.deleteProperty); //DELETE /properties
module.exports = router;
