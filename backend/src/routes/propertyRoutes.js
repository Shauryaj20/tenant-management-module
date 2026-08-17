const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', propertyController.createProperty); 
router.get('/', propertyController.getProperties);   
router.delete('/:id', propertyController.deleteProperty); 
router.put('/:id', propertyController.updateProperty);
module.exports = router;
