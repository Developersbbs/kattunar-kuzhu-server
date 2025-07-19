const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  type: {
    type: String,
    enum: ['general', 'business', 'training', 'one-on-one'],
    default: 'general',
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: function () {
      // required for all types except one-on-one
      return this.type !== 'one-on-one';
    }
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  resources: [String], // filenames or URLs

  recursive: {
    type: Boolean,
    default: false
  },

  recurrenceType: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: function () {
      return this.recursive === true && this.type === 'general';
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);
