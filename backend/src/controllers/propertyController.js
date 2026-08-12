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