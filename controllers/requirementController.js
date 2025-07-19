const Requirement = require('../models/Requirement');
const User = require('../models/User');

const requirementController = {
  // ✅ CREATE Requirement
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

      const createdBy = req.userId || req.body.createdBy;
      const user = await User.findById(createdBy);
if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
  return res.status(403).json({
    success: false,
    message: 'Only admin or superadmin can create meetings.'
  });
}

      if (!title || !category || !createdBy) {
        return res.status(400).json({
          success: false,
          message: "Title, category, and createdBy are required."
        });
      }

      let finalTaggedMembers = [];

      if (!isPublic) {
        if (!taggedMembers || taggedMembers.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Tagged members are required for private requirement."
          });
        }
        finalTaggedMembers = taggedMembers;
      }

      const newRequirement = new Requirement({
        title,
        description,
        category,
        budget,
        timeline,
        isPublic,
        taggedMembers: finalTaggedMembers,
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

  // ✅ GET ALL Requirements (for admin maybe)
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
      res.status(500).json({
        success: false,
        message: "Failed to fetch requirements."
      });
    }
  },

  // ✅ GET Public Requirements
  getPublicRequirements: async (req, res) => {
    try {
      const publicRequirements = await Requirement.find({ isPublic: true })
        .populate('createdBy', 'name mobile');

      res.status(200).json({
        success: true,
        data: publicRequirements
      });
    } catch (error) {
      console.error("Error fetching public requirements:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch public requirements."
      });
    }
  },

  // ✅ GET Tagged Requirements for a user
  getTaggedRequirements: async (req, res) => {
  try {
    const tagged = await Requirement.find({
      taggedMembers: { $exists: true, $not: { $size: 0 } }
    })
    .populate('createdBy', 'name mobile')
    .populate('taggedMembers', 'name mobile');

    res.status(200).json({
      success: true,
      data: tagged
    });
  } catch (error) {
    console.error("Error fetching tagged requirements:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tagged requirements." });
  }
}

};

module.exports = requirementController;
