const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', tenantController.createTenant); 
router.get('/', tenantController.getTenants);    
router.delete('/:id', tenantController.deleteTenant);
router.put('/:id', tenantController.updateTenant);

module.exports = router;