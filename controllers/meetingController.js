const Meeting = require('../models/Meeting');
const Group = require('../models/Group');
const User = require('../models/User');

const meetingController = {
  // CREATE a meeting
  createMeeting: async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        time,
        location,
        type,
        group,
        recurrence,
        attendees
      } = req.body;

      const createdBy = req.user?.id || req.body.createdBy;
      const user = await User.findById(createdBy);
if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
  return res.status(403).json({
    success: false,
    message: 'Only admin or superadmin can create meetings.'
  });
}

      // Basic validation
      if (!title || !date || !time || !type) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
      }

      if (!['general', 'business', 'training', 'one-on-one'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid meeting type.' });
      }

      // For group-based meetings
      if (['general', 'business', 'training'].includes(type)) {
        if (!group) {
          return res.status(400).json({ success: false, message: 'Group is required for this meeting type.' });
        }

        const groupExists = await Group.findById(group);
        if (!groupExists) {
          return res.status(404).json({ success: false, message: 'Group not found.' });
        }
      }

      // General meeting recurrence
      if (type === 'general' && recurrence && !['weekly', 'monthly', 'none'].includes(recurrence)) {
        return res.status(400).json({ success: false, message: 'Invalid recurrence option.' });
      }

      // One-on-one meeting
      if (type === 'one-on-one') {
        if (!attendees || attendees.length !== 2) {
          return res.status(400).json({ success: false, message: 'One-on-one meeting must have exactly 2 attendees.' });
        }

        const users = await User.find({ _id: { $in: attendees } });
        if (users.length !== 2) {
          return res.status(400).json({ success: false, message: 'One or both attendees not found.' });
        }
      }

      const meeting = await Meeting.create({
        title,
        description,
        date,
        time,
        location,
        type,
        recurrence: type === 'general' ? recurrence || 'none' : 'none',
        group: ['general', 'business', 'training'].includes(type) ? group : undefined,
        attendees: attendees || [],
        createdBy
      });

      res.status(201).json({
        success: true,
        message: 'Meeting created successfully',
        meeting
      });

    } catch (err) {
      console.error('Error creating meeting:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
      });
    }
  },

  // GET all meetings
  getAllMeetings: async (req, res) => {
    try {
      const meetings = await Meeting.find()
        .populate('createdBy', 'name mobile')
        .populate('attendees', 'name mobile')
        .populate('group', 'name')
        .sort({ date: 1, time: 1 });

      res.status(200).json({
        success: true,
        data: meetings
      });
    } catch (error) {
      console.error('Error fetching meetings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch meetings',
        error: error.message
      });
    }
  },

  // GET only upcoming meetings (date >= today)
  getUpcomingMeetings: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      const upcoming = await Meeting.find({ date: { $gte: today } })
        .populate('createdBy', 'name mobile')
        .populate('attendees', 'name mobile')
        .populate('group', 'name')
        .sort({ date: 1, time: 1 });

      res.status(200).json({
        success: true,
        data: upcoming
      });
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming meetings',
        error: error.message
      });
    }
  },
  // GET only today's meetings
getTodaysMeetings: async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const meetingsToday = await Meeting.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    })
      .populate('createdBy', 'name mobile')
      .populate('attendees', 'name mobile')
      .populate('group', 'name')
      .sort({ time: 1 });

    res.status(200).json({
      success: true,
      data: meetingsToday
    });
  } catch (error) {
    console.error('Error fetching today\'s meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s meetings',
      error: error.message
    });
  }
},
getMeetingsByDate: async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required in YYYY-MM-DD format.'
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meetings = await Meeting.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
      .populate('createdBy', 'name mobile')
      .populate('attendees', 'name mobile')
      .populate('group', 'name')
      .sort({ time: 1 });

    res.status(200).json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Error fetching meetings by date:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch meetings',
      error: error.message
    });
  }
},
getOneOnOneMeetings: async (req, res) => {
  try {
    const now = new Date();

    const upcoming = await Meeting.find({
      type: 'one-on-one',
      date: { $gte: now }
    })
      .populate('attendees', 'name mobile')
      .populate('createdBy', 'name mobile')
      .sort({ date: 1, time: 1 });

    const past = await Meeting.find({
      type: 'one-on-one',
      date: { $lt: now }
    })
      .populate('attendees', 'name mobile')
      .populate('createdBy', 'name mobile')
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      upcomingMeetings: upcoming,
      pastMeetings: past
    });
  } catch (err) {
    console.error('Error fetching one-on-one meetings:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch one-on-one meetings',
      error: err.message
    });
  }
}



};

module.exports = meetingController;
