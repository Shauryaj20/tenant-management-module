const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Tenant = require('../models/Tenant');
const Tenancy = require('../models/Tenancy');

exports.getSummary = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    // Fetch all counts concurrently for the logged-in user's organization
    const [totalProperties, totalUnits, totalTenants, totalActiveTenancies] = await Promise.all([
      Property.countDocuments({ organizationId: orgId }),
      Unit.countDocuments({ organizationId: orgId }),
      Tenant.countDocuments({ organizationId: orgId }),
      Tenancy.countDocuments({ organizationId: orgId, status: 'active' })
    ]);

    res.status(200).json({
      totalProperties,
      totalUnits,
      totalTenants,
      totalActiveTenancies
    });
  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard summary' });
  }
};