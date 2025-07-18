const Requirement = require('../models/Requirement');

const requirementController = {
  createRequirement: async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        budget,
        timeline,
        isPublic,
        taggedMembers
      } = req.body;

      const createdBy = req.userId || req.body.createdBy; // if you're using middleware to attach user

      if (!title || !category || !createdBy) {
        return res.status(400).json({
          success: false,
          message: "Title, category, and createdBy are required."
        });
      }

      const newRequirement = new Requirement({
        title,
        description,
        category,
        budget,
        timeline,
        isPublic,
        taggedMembers,
        createdBy
      });

      await newRequirement.save();

      res.status(201).json({
        success: true,
        message: "Requirement created successfully.",
        data: newRequirement
      });

    } catch (error) {
      console.error("Requirement creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create requirement.",
        error: error.message
      });
    }
  },

  getAllRequirements: async (req, res) => {
    try {
      const requirements = await Requirement.find()
        .populate('createdBy', 'name mobile')
        .populate('taggedMembers', 'name mobile');

      res.status(200).json({
        success: true,
        data: requirements
      });
    } catch (error) {
      console.error("Fetch error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch requirements." });
    }
  }
};

module.exports = requirementController;
