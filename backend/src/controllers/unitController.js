const Unit = require('../models/Unit');
const Property = require('../models/Property');

exports.createUnit = async (req, res) => {
  try {
    const { unitNumber, rentAmount, propertyId } = req.body;

    if (!unitNumber || !rentAmount || !propertyId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Security Check: Ensure the property exists AND belongs to the logged-in user's organization
    const property = await Property.findOne({ _id: propertyId, organizationId: req.user.organizationId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found or access denied' });
    }

    // Create the unit, locking it to both the property and the organization
    const unit = new Unit({
      unitNumber,
      rentAmount,
      propertyId,
      organizationId: req.user.organizationId
    });

    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    console.error('Create Unit Error:', error);
    res.status(500).json({ message: 'Server error creating unit' });
  }
};

exports.getUnits = async (req, res) => {
  try {
    // Fetch units for the organization, and populate the property details so we can see the property name
    const units = await Unit.find({ organizationId: req.user.organizationId })
                            .populate('propertyId', 'name address');
    res.status(200).json(units);
  } catch (error) {
    console.error('Get Units Error:', error);
    res.status(500).json({ message: 'Server error fetching units' });
  }
};