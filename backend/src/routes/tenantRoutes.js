const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all tenant routes with our auth middleware
router.use(authMiddleware);

router.post('/', tenantController.createTenant); // POST /tenants
router.get('/', tenantController.getTenants);    // GET /tenants

module.exports = router;