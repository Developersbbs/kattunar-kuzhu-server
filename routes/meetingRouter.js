const express = require('express');
const meetingRouter = express.Router();
const meetingController = require('../controllers/meetingController');

meetingRouter.post('/create', meetingController.createMeeting);
meetingRouter.get('/upcoming',meetingController.getUpcomingMeetings);
meetingRouter.get('/today',meetingController.getTodaysMeetings);
meetingRouter.get('/by-date',meetingController.getMeetingsByDate);
meetingRouter.get('/one-one',meetingController.getOneOnOneMeetings);

module.exports = meetingRouter;
