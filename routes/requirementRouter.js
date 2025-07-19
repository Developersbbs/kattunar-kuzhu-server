const express = require('express');
const requirementController = require('../controllers/requirementController');

const requirementRouter = express.Router();

requirementRouter.post('/', requirementController.createRequirement);
requirementRouter.get('/', requirementController.getAllRequirements);
requirementRouter.get("/public",requirementController.getPublicRequirements)
requirementRouter.get("/tagged",requirementController.getTaggedRequirements);

module.exports = requirementRouter;
