const Meeting = require('../models/Meeting');
const User = require('../models/User');

const meetingController = {
  createMeeting: async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        time,
        location,
        type,
        createdBy,
        attendees = [],
        resources = []
      } = req.body;

      if (!title || !date || !time || !location || !type || !createdBy) {
        return res.status(400).json({
          success: false,
          message: "Required fields are missing."
        });
      }

      const meeting = await Meeting.create({
        title,
        description,
        date,
        time,
        location,
        type,
        createdBy,
        attendees,
        resources
      });

      res.status(201).json({
        success: true,
        message: "Meeting created successfully",
        data: meeting
      });
    } catch (err) {
      console.error("Create meeting error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to create meeting",
        error: err.message
      });
    }
  },

  // ✅ Get all meetings
  getAllMeetings: async (req, res) => {
    try {
      const meetings = await Meeting.find()
        .populate('createdBy', 'name email')
        .populate('attendees', 'name email');

      res.status(200).json({
        success: true,
        data: meetings
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch meetings',
        error: err.message
      });
    }
  },

  // ✅ Get a single meeting
  getMeetingById: async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('attendees', 'name email');

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: 'Meeting not found'
        });
      }

      res.status(200).json({
        success: true,
        data: meeting
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch meeting',
        error: err.message
      });
    }
  },

  // ✅ Update a meeting
  updateMeeting: async (req, res) => {
    try {
      const updated = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Meeting not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Meeting updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to update meeting',
        error: err.message
      });
    }
  },

  // ✅ Delete a meeting
  deleteMeeting: async (req, res) => {
    try {
      const deleted = await Meeting.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Meeting not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Meeting deleted successfully'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete meeting',
        error: err.message
      });
    }
  }
};

module.exports = meetingController;
