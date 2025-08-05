const { Signature, User, School } = require('../models');
const { Op } = require('sequelize');

// Get user's signature
const getUserSignature = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching signature for user:', userId);
    
    const signature = await Signature.findOne({
      where: {
        userId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'role']
        }
      ]
    });

    if (!signature) {
      console.log('No signature found for user:', userId);
      return res.status(404).json({
        success: false,
        message: 'No active signature found for this user'
      });
    }

    console.log('Signature found for user:', userId, 'Type:', signature.signatureType);

    res.json({
      success: true,
      signature: {
        id: signature.id,
        signatureData: signature.signatureData,
        signatureType: signature.signatureType,
        createdAt: signature.createdAt,
        user: signature.user
      }
    });
  } catch (error) {
    console.error('Error fetching signature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch signature',
      error: error.message
    });
  }
};

// Get school signatures (for admins)
const getSchoolSignatures = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const signatures = await Signature.findAll({
      where: {
        schoolId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'role', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      signatures: signatures.map(sig => ({
        id: sig.id,
        signatureType: sig.signatureType,
        createdAt: sig.createdAt,
        user: sig.user
      }))
    });
  } catch (error) {
    console.error('Error fetching school signatures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school signatures',
      error: error.message
    });
  }
};

// Upload/Update signature
const uploadSignature = async (req, res) => {
  try {
    const { signatureData, signatureType = 'teacher' } = req.body;
    const userId = req.user.id;
    const schoolId = req.user.schoolId;

    console.log('Uploading signature:', { userId, schoolId, signatureType });

    if (!signatureData) {
      return res.status(400).json({
        success: false,
        message: 'Signature data is required'
      });
    }

    // Validate signature type based on user role
    const allowedTypes = {
      'teacher': ['teacher'],
      'school_admin': ['teacher', 'principal', 'admin'],
      'system_admin': ['teacher', 'principal', 'admin']
    };

    const userAllowedTypes = allowedTypes[req.user.role] || ['teacher'];
    if (!userAllowedTypes.includes(signatureType)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create this type of signature'
      });
    }

    // Deactivate existing signatures for this user
    await Signature.update(
      { isActive: false },
      {
        where: {
          userId,
          signatureType,
          isActive: true
        }
      }
    );

    // Create new signature
    const signature = await Signature.create({
      userId,
      schoolId,
      signatureData,
      signatureType,
      isActive: true
    });

    console.log('Signature created successfully:', signature.id);

    res.json({
      success: true,
      message: 'Signature uploaded successfully',
      signature: {
        id: signature.id,
        signatureType: signature.signatureType,
        createdAt: signature.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading signature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload signature',
      error: error.message
    });
  }
};

// Delete signature
const deleteSignature = async (req, res) => {
  try {
    const { signatureId } = req.params;
    const userId = req.user.id;

    const signature = await Signature.findOne({
      where: {
        id: signatureId,
        userId,
        isActive: true
      }
    });

    if (!signature) {
      return res.status(404).json({
        success: false,
        message: 'Signature not found'
      });
    }

    // Soft delete by setting isActive to false
    await signature.update({ isActive: false });

    res.json({
      success: true,
      message: 'Signature deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting signature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete signature',
      error: error.message
    });
  }
};

// Get signature for progress reports (by user ID and type)
const getSignatureForReports = async (req, res) => {
  try {
    const { userId, signatureType = 'teacher' } = req.params;

    const signature = await Signature.findOne({
      where: {
        userId,
        signatureType,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'role']
        }
      ]
    });

    if (!signature) {
      return res.status(404).json({
        success: false,
        message: 'Signature not found'
      });
    }

    res.json({
      success: true,
      signature: {
        signatureData: signature.signatureData,
        user: signature.user
      }
    });
  } catch (error) {
    console.error('Error fetching signature for reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch signature',
      error: error.message
    });
  }
};

module.exports = {
  getUserSignature,
  getSchoolSignatures,
  uploadSignature,
  deleteSignature,
  getSignatureForReports
}; 