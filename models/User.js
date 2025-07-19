const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },

  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  role: {
    type: String,
    enum: ['member', 'admin', 'superadmin'],
    default: 'member'
  },
  profileImage: { type: String},

  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
