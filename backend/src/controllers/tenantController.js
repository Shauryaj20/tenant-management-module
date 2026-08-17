const Tenant = require('../models/Tenant');
const Tenancy = require('../models/Tenancy');

exports.createTenant = async (req, res) => {
  try {
    const { name, email, phone, documentUrl } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const tenant = new Tenant({
      name,
      email,
      phone,
      documentUrl, 
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
    const tenants = await Tenant.find({ organizationId: req.user.organizationId });
    res.status(200).json(tenants);
  } catch (error) {
    console.error('Get Tenants Error:', error);
    res.status(500).json({ message: 'Server error fetching tenants' });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const deletedTenant = await Tenant.findByIdAndDelete(tenantId);    
    if (!deletedTenant) return res.status(404).json({ message: 'Tenant not found' });

    await Tenancy.deleteMany({ tenantId: tenantId });

    res.status(200).json({ message: 'Tenant and associated tenancies deleted successfully' });
  } catch (error) {
    console.error('Delete Tenant Error:', error);
    res.status(500).json({ message: 'Server error deleting tenant' });
  }
};
exports.updateTenant = async (req, res) => {
  try {
    const updatedTenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTenant) return res.status(404).json({ message: 'Tenant not found' });
    res.status(200).json(updatedTenant);
  } catch (error) {
    console.error('Update Tenant Error:', error);
    res.status(500).json({ message: 'Server error updating tenant' });
  }
};