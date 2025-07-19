const User = require('../models/User');
const Group = require('../models/Group');
const Business = require('../models/Business');
const mongoose = require('mongoose');
const authController = {
  register: async (req, res) => {
    try {
      const {
        group,
        name,
        mobile,
        email,
        profileImage,
        businessName,
        businessCategory,
        businessAddress,
        contactNumber
      } = req.body;

      // 1. Validate required fields
      if (!group || !name || !mobile || !businessName || !businessCategory || !businessAddress) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing."
        });
      }

      // 2. Find group
      const existingGroup = await Group.findOne({ name: group });
      if (!existingGroup) {
        return res.status(404).json({
          success: false,
          message: "Group not found"
        });
      }

      // 3. Check if user already exists
      const existingUser = await User.findOne({ mobile });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already registered"
        });
      }

      // 4. Create user
      const user = await User.create({
        group: existingGroup._id,
        name,
        mobile,
        email,
        profileImage
      });

      // 5. Check if business exists
      let business = await Business.findOne({ businessName: businessName.trim() });

      if (business) {

        // Check if already 2 owners
        if (business.owner.length >= 2) {
          return res.status(400).json({
            success: false,
            message: "This business already has 2 owners"
          });
        }

        // Check if user is already an owner
        const isAlreadyOwner = business.owner.map(id => id.toString()).includes(user._id.toString());
        if (isAlreadyOwner) {
          return res.status(400).json({
            success: false,
            message: "User already owns this business"
          });
        }

        // Add as second owner
        business.owner.push(user._id);
        await business.save();

      } else {
        // Create new business with this user as first owner
        business = await Business.create({
          group: existingGroup._id,
          owner: [user._id],
          businessName: businessName.trim(),
          businessCategory,
          businessAddress,
          contactNumber
        });
      }

      res.status(201).json({
        success: true,
        message: "User and business registered successfully",
        data: {
          user,
          business
        }
      });

    } catch (err) {
      console.error("❌ Registration error:", err);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message
      });
    }
  },
  superAdmin: async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    try {
      const user = await User.findOne({ mobile, role: 'superadmin' });

      if (!user) {
        return res.status(403).json({ message: 'Invalid mobile or not superadmin' });
      }

      res.status(200).json({
        message: 'Login successful',
        loginAt: new Date(),
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          role: user.role,
          email: user.email
        }
      });

    } catch (err) {
      console.error('Superadmin login error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getAllMembers: async (req, res) => {
    try {
      const members = await User.find({ role: 'member' })
        .select('-__v')
        .populate('group', 'name');

      res.status(200).json({
        success: true,
        members
      });
    } catch (err) {
      console.error('Error fetching members:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch members',
        error: err.message
      });
    }
  },
  approveUser: async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { approved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      user
    });

  } catch (err) {
    console.error("Error approving user:", err);
    res.status(500).json({
      success: false,
      message: "Approval failed",
      error: err.message
    });
  }
}
};
module.exports = authController;