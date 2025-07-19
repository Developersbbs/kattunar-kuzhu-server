const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referralType: {
    type: String,
    enum: ['member', 'manual'],
    required: true
  },
  referredMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  manualReferral: {
    contactName: String,
    companyName: String,
    phone: String,
    email: String
  },
  requirementDescription: {
    type: String,
    required: true
  },
  notes: String,
  attachments: [String], // Store filenames or file URLs
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Referral', referralSchema);
