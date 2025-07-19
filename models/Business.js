const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref:"User",default:[]}],
    businessName: { type: String, required: true },
    businessCategory: { type: String, required: true },
    businessAddress: { type: String, required: true },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('business', businessSchema);
