const mongoose = require('mongoose');

const tenancySchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true }
}, { timestamps: true });

// Ensures a unit can only have ONE active tenancy at a time
tenancySchema.index(
  { unitId: 1 }, 
  { unique: true, partialFilterExpression: { status: 'active' } }
);

module.exports = mongoose.model('Tenancy', tenancySchema);