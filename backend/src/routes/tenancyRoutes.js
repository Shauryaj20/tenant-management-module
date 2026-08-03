const express = require('express');
const router = express.Router();
const tenancyController = require('../controllers/tenancyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', tenancyController.createTenancy); 
router.get('/', tenancyController.getTenancies);   

module.exports = router;