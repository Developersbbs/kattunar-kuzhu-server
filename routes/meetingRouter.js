const express = require('express');
const meetingRouter = express.Router();
const meetingController = require('../controllers/meetingController');

// Create a new meeting
meetingRouter.post('/', meetingController.createMeeting);

// Get all meetings
meetingRouter.get('/', meetingController.getAllMeetings);

// Get a specific meeting by ID
meetingRouter.get('/:id', meetingController.getMeetingById);

// Update a meeting by ID
meetingRouter.put('/:id', meetingController.updateMeeting);

// Delete a meeting by ID
meetingRouter.delete('/:id', meetingController.deleteMeeting);

module.exports = meetingRouter;
