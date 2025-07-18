const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  budget: {
    type: Number
  },
  timeline: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  taggedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Requirement', requirementSchema);
