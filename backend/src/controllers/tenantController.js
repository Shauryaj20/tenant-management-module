const Tenant = require('../models/Tenant');

exports.createTenant = async (req, res) => {
  try {
    const { name, email, phone, documentUrl } = req.body;

    // 1. Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // 2. Create the tenant, locked to the user's organization
    const tenant = new Tenant({
      name,
      email,
      phone,
      documentUrl, // We will use this later when we build the file upload
      organizationId: req.user.organizationId
    });

    await tenant.save();
    res.status(201).json(tenant);
  } catch (error) {
    console.error('Create Tenant Error:', error);
    res.status(500).json({ message: 'Server error creating tenant' });
  }
};

exports.getTenants = async (req, res) => {
  try {
    // 3. Fetch ONLY tenants that belong to the logged-in user's organization
    const tenants = await Tenant.find({ organizationId: req.user.organizationId });
    res.status(200).json(tenants);
  } catch (error) {
    console.error('Get Tenants Error:', error);
    res.status(500).json({ message: 'Server error fetching tenants' });
  }
};