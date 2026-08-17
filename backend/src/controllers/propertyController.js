const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Tenancy = require('../models/Tenancy');

exports.createProperty = async (req, res) => {
  try {
    const { name, address, type } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }

    const property = new Property({
      name,
      address,
      type,
      organizationId: req.user.organizationId
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Create Property Error:', error);
    res.status(500).json({ message: 'Server error creating property' });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ organizationId: req.user.organizationId });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Get Properties Error:', error);
    res.status(500).json({ message: 'Server error fetching properties' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const attachedUnits = await Unit.countDocuments({ propertyId: req.params.id });
    if (attachedUnits > 0) {
      return res.status(400).json({ 
        message: `Cannot delete: This property still has ${attachedUnits} unit(s) attached to it. Please delete or reassign the units first.` 
      });
    }
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);    
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete Property Error:', error);
    res.status(500).json({ message: 'Server error deleting property' });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Update Property Error:', error);
    res.status(500).json({ message: 'Server error updating property' });
  }
};