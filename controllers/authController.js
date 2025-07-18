const User = require('../models/User');

const authController = {
  register : async (req, res) => {
  try {
    const {
      group,
      name,
      mobile,
      email,
      profileImage,
      businessName,
      businessCategory,
      businessAddress
    } = req.body;

    // Basic validation (recommended)
    if (!group || !name || !mobile || !profileImage || !businessName || !businessCategory || !businessAddress) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided."
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This mobile number already exists'
      });
    }

    const newUser = await User.create({
      group,
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

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        group: newUser.group,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        profileImage: newUser.profileImage,
        businessInfo: newUser.businessInfo,
        createdAt: newUser.createdAt
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
    const members = await User.find({ role: 'member' }).select('-__v');

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
},



};

module.exports = authController;
