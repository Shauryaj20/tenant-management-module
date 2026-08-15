const Unit = require('../models/Unit');
const Property = require('../models/Property');
const Tenancy = require('../models/Tenancy');

exports.createUnit = async (req, res) => {
  try {
    const { unitNumber, rentAmount, propertyId } = req.body;

    if (!unitNumber || !rentAmount || !propertyId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const property = await Property.findOne({ _id: propertyId, organizationId: req.user.organizationId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found or access denied' });
    }

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
    const units = await Unit.find({ organizationId: req.user.organizationId })
                            .populate('propertyId', 'name address');
    res.status(200).json(units);
  } catch (error) {
    console.error('Get Units Error:', error);
    res.status(500).json({ message: 'Server error fetching units' });
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const unitId = req.params.id;
    const deletedUnit = await Unit.findByIdAndDelete(unitId);
    
    if (!deletedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    await Tenancy.deleteMany({ unitId: unitId });

    res.status(200).json({ message: 'Unit and associated tenancies deleted successfully' });
  } catch (error) {
    console.error('Delete Unit Error:', error); 
    res.status(500).json({ message: 'Server error deleting unit' });
  }
};