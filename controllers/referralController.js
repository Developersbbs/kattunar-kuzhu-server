const Referral = require('../models/Referral');

const referralController = {
  createReferral: async (req, res) => {
    try {
      const {
        referralType,
        referredMember,
        manualReferral,
        requirementDescription,
        notes,
        attachments
      } = req.body;

      const referredBy = req.userId || req.body.referredBy;

      if (!referralType || !requirementDescription || !referredBy) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields."
        });
      }

      if (referralType === 'member' && !referredMember) {
        return res.status(400).json({
          success: false,
          message: "referredMember is required for member referral."
        });
      }

      if (referralType === 'manual') {
        const { contactName, companyName, phone } = manualReferral || {};
        if (!contactName || !companyName || !phone) {
          return res.status(400).json({
            success: false,
            message: "Manual referral must include contactName, companyName, and phone."
          });
        }
      }

      const newReferral = new Referral({
        referralType,
        referredMember: referralType === 'member' ? referredMember : null,
        manualReferral: referralType === 'manual' ? manualReferral : null,
        requirementDescription,
        notes,
        attachments,
        referredBy
      });

      await newReferral.save();

      res.status(201).json({
        success: true,
        message: 'Referral created successfully',
        data: newReferral
      });

    } catch (error) {
      console.error('Referral creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create referral',
        error: error.message
      });
    }
  }
};

module.exports = referralController;
