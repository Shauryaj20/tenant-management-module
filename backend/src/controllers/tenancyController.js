const Tenancy = require('../models/Tenancy');
const Unit = require('../models/Unit');
const Tenant = require('../models/Tenant');

exports.createTenancy = async (req, res) => {
  try {
    const { tenantId, unitId, startDate } = req.body;

    // 1. Validate required fields
    if (!tenantId || !unitId || !startDate) {
      return res.status(400).json({ message: 'Tenant, Unit, and Start Date are required' });
    }

    // 2. Validate Ownership of Unit and Tenant
    const unit = await Unit.findOne({ _id: unitId, organizationId: req.user.organizationId });
    const tenant = await Tenant.findOne({ _id: tenantId, organizationId: req.user.organizationId });
    
    if (!unit || !tenant) {
      return res.status(404).json({ message: 'Unit or Tenant not found in your organization' });
    }

    // 3. ENFORCE ASSIGNMENT CONSTRAINT: Check for an existing active tenancy
    const existingActiveTenancy = await Tenancy.findOne({ unitId, status: 'active' });
    if (existingActiveTenancy) {
      return res.status(400).json({ message: 'This unit already has an active tenancy.' });
    }

    // 4. Create the Tenancy
    const tenancy = new Tenancy({
      tenantId,
      unitId,
      startDate,
      organizationId: req.user.organizationId
    });

    await tenancy.save();
    res.status(201).json(tenancy);
  } catch (error) {
    console.error('Create Tenancy Error:', error);
    res.status(500).json({ message: 'Server error creating tenancy' });
  }
};

exports.getTenancies = async (req, res) => {
  try {
    // 5. Fetch tenancies for the org and populate the related tenant and unit data
    const tenancies = await Tenancy.find({ organizationId: req.user.organizationId })
      .populate('tenantId', 'name email')
      .populate('unitId', 'unitNumber');
    res.status(200).json(tenancies);
  } catch (error) {
    console.error('Get Tenancies Error:', error);
    res.status(500).json({ message: 'Server error fetching tenancies' });
  }
};