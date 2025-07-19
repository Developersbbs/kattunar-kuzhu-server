const express = require('express');
const referralController = require('../controllers/referralController');
const referralRouter = express.Router();

referralRouter.post('/', referralController.createReferral);

module.exports = referralRouter;
