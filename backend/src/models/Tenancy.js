const mongoose = require('mongoose');

const tenancySchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true 
  },
  rentAmount: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true,
    default: 0
  },
  // ------------------------
  status: {
    type: String,
    enum: ['Active', 'Terminated', 'Expired'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Tenancy', tenancySchema);