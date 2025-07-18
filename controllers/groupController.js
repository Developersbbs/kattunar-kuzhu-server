const Group = require('../models/Group');
const User = require('../models/User');

const groupController = {
  // ✅ Create a new group
  createGroup: async (req, res) => {
    try {
      const { name, memberLimit, gdLeader } = req.body;

      // Validate input
      if (!name || !memberLimit || !gdLeader) {
        return res.status(400).json({
          success: false,
          message: 'Group name, member limit, and GD leader are required'
        });
      }

      // Check for duplicate group name
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: 'Group name already exists'
        });
      }

      // Create group
      const group = await Group.create({
        name,
        memberLimit,
        gdLeader,
        status: 'active'
      });

      res.status(201).json({
        success: true,
        message: 'Group created successfully',
        data: group
      });

    } catch (err) {
      console.error('Error creating group:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to create group',
        error: err.message
      });
    }
  },

  // ✅ Get all groups
  getAllGroups: async (req, res) => {
    try {
      const groups = await Group.find().select('-__v');
      res.status(200).json({
        success: true,
        data: groups
      });
    } catch (err) {
      console.error('Error fetching groups:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch groups',
        error: err.message
      });
    }
  },

  // ✅ Get all users of a group by group name
  getUsersByGroupName: async (req, res) => {
    try {
      const { groupName } = req.params;

      const group = await Group.findOne({ name: groupName });
      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found' });
      }

      const users = await User.find({ group: group._id }).populate('group', 'name');

      res.status(200).json({
        success: true,
        group: group.name,
        users
      });

    } catch (err) {
      console.error('Error fetching users by group:', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
};

module.exports = groupController;
