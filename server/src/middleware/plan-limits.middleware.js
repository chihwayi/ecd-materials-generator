const { User, Student, Class, School, SubscriptionPlan } = require('../models');

// Check if school can add more teachers
const checkTeacherLimit = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId || req.body.schoolId;
    if (!schoolId) return next();

    const school = await School.findByPk(schoolId);
    if (!school) return res.status(404).json({ error: 'School not found' });

    const plan = await SubscriptionPlan.findOne({ where: { planId: school.subscriptionPlan } });
    const maxTeachers = plan?.maxTeachers || 5;
    
    if (maxTeachers === -1) return next(); // Unlimited

    const [teacherCount, adminCount] = await Promise.all([
      User.count({ where: { schoolId, role: 'teacher' } }),
      User.count({ where: { schoolId, role: 'school_admin' } })
    ]);

    const totalTeachers = teacherCount + adminCount;
    
    if (totalTeachers >= maxTeachers) {
      return res.status(403).json({ 
        error: 'Teacher limit reached',
        message: `Your ${plan?.name || 'current'} plan allows only ${maxTeachers} teachers. Please upgrade to add more.`,
        currentCount: totalTeachers,
        limit: maxTeachers,
        upgradeRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Teacher limit check error:', error);
    next();
  }
};

// Check if school can add more students
const checkStudentLimit = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId || req.body.schoolId;
    if (!schoolId) return next();

    const school = await School.findByPk(schoolId);
    if (!school) return res.status(404).json({ error: 'School not found' });

    const plan = await SubscriptionPlan.findOne({ where: { planId: school.subscriptionPlan } });
    const maxStudents = plan?.maxStudents || 100;
    
    if (maxStudents === -1) return next(); // Unlimited

    const studentCount = await Student.count({ where: { schoolId } });
    
    if (studentCount >= maxStudents) {
      return res.status(403).json({ 
        error: 'Student limit reached',
        message: `Your ${plan?.name || 'current'} plan allows only ${maxStudents} students. Please upgrade to add more.`,
        currentCount: studentCount,
        limit: maxStudents,
        upgradeRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Student limit check error:', error);
    next();
  }
};

// Check if school can add more classes
const checkClassLimit = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId || req.body.schoolId;
    if (!schoolId) return next();

    const school = await School.findByPk(schoolId);
    if (!school) return res.status(404).json({ error: 'School not found' });

    const plan = await SubscriptionPlan.findOne({ where: { planId: school.subscriptionPlan } });
    const maxClasses = plan?.maxClasses || -1;
    
    if (maxClasses === -1) return next(); // Unlimited

    const classCount = await Class.count({ where: { schoolId } });
    
    if (classCount >= maxClasses) {
      return res.status(403).json({ 
        error: 'Class limit reached',
        message: `Your ${plan?.name || 'current'} plan allows only ${maxClasses} classes. Please upgrade to add more.`,
        currentCount: classCount,
        limit: maxClasses,
        upgradeRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Class limit check error:', error);
    next();
  }
};

module.exports = {
  checkTeacherLimit,
  checkStudentLimit,
  checkClassLimit
};