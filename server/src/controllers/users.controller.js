const { User, School } = require('../models');
const { Op } = require('sequelize');

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      subscriptionPlan,
      subscriptionStatus,
      isActive,
      schoolId,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (role) where.role = role;
    if (subscriptionPlan) where.subscriptionPlan = subscriptionPlan;
    if (subscriptionStatus) where.subscriptionStatus = subscriptionStatus;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (schoolId) where.schoolId = schoolId;
    
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{
        model: School,
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      include: [{
        model: School,
        attributes: ['id', 'name', 'address', 'contactEmail']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phoneNumber,
      language,
      schoolId,
      subscriptionPlan
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Validate school if provided
    if (schoolId) {
      const school = await School.findByPk(schoolId);
      if (!school) {
        return res.status(400).json({ message: 'School not found' });
      }
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'teacher',
      phoneNumber,
      language: language || 'en',
      schoolId,
      subscriptionPlan: subscriptionPlan || 'free'
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate school if provided
    if (updates.schoolId) {
      const school = await School.findByPk(updates.schoolId);
      if (!school) {
        return res.status(400).json({ message: 'School not found' });
      }
    }

    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: updates.email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    await user.update(updates);
    
    // Return updated user without password
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: School,
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of system admin if it's the last one
    if (user.role === 'system_admin') {
      const adminCount = await User.count({ where: { role: 'system_admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last system administrator' });
      }
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all schools with pagination and filtering
const getAllSchools = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subscriptionPlan,
      subscriptionStatus,
      isActive,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (subscriptionPlan) where.subscriptionPlan = subscriptionPlan;
    if (subscriptionStatus) where.subscriptionStatus = subscriptionStatus;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { contactEmail: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await School.findAndCountAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'role'],
        separate: true
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Add user counts to each school
    const schoolsWithCounts = await Promise.all(rows.map(async (school) => {
      const userCount = await User.count({ where: { schoolId: school.id } });
      return {
        ...school.toJSON(),
        _count: {
          users: userCount
        }
      };
    }));

    res.json({
      data: schoolsWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all schools error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new school
const createSchool = async (req, res) => {
  try {
    const {
      name,
      address,
      contactEmail,
      contactPhone,
      subscriptionPlan,
      maxTeachers,
      maxStudents
    } = req.body;

    const school = await School.create({
      name,
      address,
      contactEmail,
      contactPhone,
      subscriptionPlan: subscriptionPlan || 'free',
      maxTeachers: maxTeachers || 5,
      maxStudents: maxStudents || 100
    });

    res.status(201).json(school);
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update school
const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const school = await School.findByPk(id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    await school.update(updates);
    
    const updatedSchool = await School.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'role']
      }]
    });

    res.json(updatedSchool);
  } catch (error) {
    console.error('Update school error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete school
const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findByPk(id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if school has users
    const userCount = await User.count({ where: { schoolId: id } });
    if (userCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete school with associated users. Please reassign or delete users first.' 
      });
    }

    await school.destroy();
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Delete school error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllSchools,
  createSchool,
  updateSchool,
  deleteSchool
};