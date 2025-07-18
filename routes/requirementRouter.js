const express = require('express');
const requirementController = require('../controllers/requirementController');

const groupRouter = express.Router();

groupRouter.post('/', requirementController.createRequirement);
groupRouter.get('/', requirementController.getAllRequirements);

module.exports = groupRouter;
