const { StudentServicePreference, Student, School } = require('../models');

// Get student service preferences
const getStudentServicePreferences = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user.schoolId;

    // Verify student belongs to the school
    const student = await Student.findOne({
      where: { id: studentId, schoolId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const preferences = await StudentServicePreference.findOne({
      where: { 
        student_id: studentId,
        school_id: schoolId,
        academic_year: req.query.academicYear || new Date().getFullYear().toString()
      }
    });

    res.json(preferences || {
      studentId,
      schoolId,
      tuitionType: null,
      transport: false,
      food: false,
      activities: false,
      auxiliary: false,
      academicYear: req.query.academicYear || new Date().getFullYear().toString()
    });
  } catch (error) {
    console.error('Error fetching student service preferences:', error);
    res.status(500).json({ error: 'Failed to fetch student service preferences' });
  }
};

// Create or update student service preferences
const saveStudentServicePreferences = async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user.schoolId;
    const {
      tuitionType,
      transport,
      food,
      activities,
      auxiliary,
      academicYear,
      notes
    } = req.body;

    // Verify student belongs to the school
    const student = await Student.findOne({
      where: { id: studentId, schoolId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find existing preferences or create new ones
    const [preferences, created] = await StudentServicePreference.findOrCreate({
      where: { 
        student_id: studentId,
        school_id: schoolId,
        academic_year: academicYear || new Date().getFullYear().toString()
      },
      defaults: {
        tuitionType,
        transport: transport || false,
        food: food || false,
        activities: activities || false,
        auxiliary: auxiliary || false,
        notes
      }
    });

    if (!created) {
      // Update existing preferences
      await preferences.update({
        tuitionType,
        transport: transport || false,
        food: food || false,
        activities: activities || false,
        auxiliary: auxiliary || false,
        notes
      });
    }

    res.json({
      message: created ? 'Service preferences created successfully' : 'Service preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Error saving student service preferences:', error);
    res.status(500).json({ error: 'Failed to save student service preferences' });
  }
};

// Get all student service preferences for a school
const getAllStudentServicePreferences = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const academicYear = req.query.academicYear || new Date().getFullYear().toString();

    const preferences = await StudentServicePreference.findAll({
      where: { school_id: schoolId, academic_year: academicYear },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'parentName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching all student service preferences:', error);
    res.status(500).json({ error: 'Failed to fetch student service preferences' });
  }
};

module.exports = {
  getStudentServicePreferences,
  saveStudentServicePreferences,
  getAllStudentServicePreferences
}; 