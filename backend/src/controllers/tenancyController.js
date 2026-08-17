const Tenancy = require('../models/Tenancy');
const Unit = require('../models/Unit');
const Tenant = require('../models/Tenant');

exports.createTenancy = async (req, res) => {
  try {
  const { tenantId, unitId, startDate, endDate, rentAmount, securityDeposit } = req.body;

    if (!tenantId || !unitId || !startDate) {
      return res.status(400).json({ message: 'Tenant, Unit, and Start Date are required' });
    }

    const unit = await Unit.findOne({ _id: unitId, organizationId: req.user.organizationId });
    const tenant = await Tenant.findOne({ _id: tenantId, organizationId: req.user.organizationId });
    
    if (!unit || !tenant) {
      return res.status(404).json({ message: 'Unit or Tenant not found in your organization' });
    }

    const existingActiveTenancy = await Tenancy.findOne({ unitId, status: 'active' });
    if (existingActiveTenancy) {
      return res.status(400).json({ message: 'This unit already has an active tenancy.' });
    }

    const tenancy = new Tenancy({
      tenantId,
      unitId,
      startDate,
      endDate,
      rentAmount,
      securityDeposit,
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
    const tenancies = await Tenancy.find({ organizationId: req.user.organizationId })
      .populate('tenantId', 'name email')
      .populate('unitId', 'unitNumber');
    res.status(200).json(tenancies);
  } catch (error) {
    console.error('Get Tenancies Error:', error);
    res.status(500).json({ message: 'Server error fetching tenancies' });
  }
};

exports.deleteTenancy = async (req, res) => {
  try {
    const deletedTenancy = await Tenancy.findByIdAndDelete(req.params.id);
    
    if (!deletedTenancy) {
      return res.status(404).json({ message: 'Tenancy not found' });
    }

    res.status(200).json({ message: 'Tenancy deleted successfully' });
  } catch (error) {
    console.error('Delete Tenancy Error:', error);
    res.status(500).json({ message: 'Server error deleting tenancy' });
  }
};