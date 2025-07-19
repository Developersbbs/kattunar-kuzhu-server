const User = require('../models/User');
const Business = require('../models/Business');

const businessController = {
  createBusiness: async (req, res) => {
    try {
      const { group, name, businessName, businessCategory, businessAddress } = req.body;

      // Create business
      const business = await Business.create({
        group,
        name,
        businessName,
        businessCategory,
        businessAddress
      });

      res.status(201).json({
        success: true,
        message: 'Business created successfully',
        data: business
      });

    } catch (err) {
      console.error('Error creating business:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to create business',
        error: err.message
      });
    }
  },

  // ✅ Get all businesses
  getAllBusinesses: async (req, res) => {
    try {
      const businesses = await Business.find().select('-__v');
      res.status(200).json({
        success: true,
        data: businesses
      });
    } catch (err) {
      console.error('Error fetching businesses:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch businesses',
        error: err.message
      });
    }
  },

  getBusinessById: async (req, res) => {
    try {
      const { id } = req.params;

      const business = await Business.findById(id);
      if (!business) {
        return res.status(404).json({ success: false, message: 'Business not found' });
      }
      res.status(200).json({
        success: true,
        data: business
      });
    } catch (err) {
      console.error('Error fetching business by ID:', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
};
module.exports = businessController;
