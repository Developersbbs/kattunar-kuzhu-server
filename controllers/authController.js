const User = require('../models/User');
const Group = require('../models/Group');

const authController = {
  register: async (req, res) => {
    try {
      const {
        group, // group name provided by frontend
        name,
        mobile,
        email,
        profileImage,
        businessName,
        businessCategory,
        businessAddress
      } = req.body;

      // Basic validation
      if (!group || !name || !mobile || !profileImage || !businessName || !businessCategory || !businessAddress) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided."
        });
      }

      let existingGroup = await Group.findOne({ name: group });
      if (!existingGroup) {
        existingGroup = await Group.create({ name: group });
        console.log(`✅ Created new group: ${group}`);
      }

      // Check for duplicate user
      const existingUser = await User.findOne({ mobile });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'This mobile number already exists'
        });
      }

      // Create new user
      const newUser = await User.create({
        group: existingGroup._id,
        name,
        mobile,
        email,
        profileImage,
        businessInfo: {
          businessName,
          businessCategory,
          businessAddress
        }
      });

      const populatedUser = await User.findById(newUser._id).populate('group', 'name');

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: populatedUser._id,
          group: populatedUser.group.name, // return group name
          name: populatedUser.name,
          email: populatedUser.email,
          mobile: populatedUser.mobile,
          profileImage: populatedUser.profileImage,
          businessInfo: populatedUser.businessInfo,
          createdAt: populatedUser.createdAt
        }
      });

    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
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

      const loginTime = new Date();

      res.status(200).json({
        message: 'Login successful',
        loginAt: loginTime,
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

  approveMember: async (req, res) => {
    const { memberId } = req.params;

    try {
      const user = await User.findOneAndUpdate(
        { _id: memberId, role: 'member' },
        { approved: true },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Member not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Member approved successfully',
        member: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          approved: user.approved
        }
      });

    } catch (err) {
      console.error('Approval error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to approve member',
        error: err.message
      });
    }
  }
};

module.exports = authController;
