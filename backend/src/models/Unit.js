const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unitNumber: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);