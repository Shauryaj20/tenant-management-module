const Property = require('../models/Property');

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
    const propertyId = req.params.id;
    
    // Find the property by ID and Organization, then delete it
    const deletedProperty = await Property.findOneAndDelete({ 
      _id: propertyId, 
      organizationId: req.user.organizationId 
    });

    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete Property Error:', error);
    res.status(500).json({ message: 'Server error deleting property' });
  }
};