const User = require('./User');
const School = require('./School');
const Template = require('./Template');
const Material = require('./Material');
const Student = require('./Student');
const Assignment = require('./Assignment');
const Progress = require('./Progress');

// Define associations
User.belongsTo(School, { foreignKey: 'schoolId' });
School.hasMany(User, { foreignKey: 'schoolId' });

Template.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
User.hasMany(Template, { foreignKey: 'creatorId', as: 'templates' });

Material.belongsTo(Template, { foreignKey: 'templateId' });
Material.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Template.hasMany(Material, { foreignKey: 'templateId' });
User.hasMany(Material, { foreignKey: 'creatorId', as: 'materials' });

Student.belongsTo(School, { foreignKey: 'schoolId' });
Student.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
School.hasMany(Student, { foreignKey: 'schoolId' });
User.hasMany(Student, { foreignKey: 'teacherId', as: 'students' });

Assignment.belongsTo(Material, { foreignKey: 'materialId' });
Assignment.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
Material.hasMany(Assignment, { foreignKey: 'materialId' });
User.hasMany(Assignment, { foreignKey: 'teacherId', as: 'assignments' });

Progress.belongsTo(Assignment, { foreignKey: 'assignmentId' });
Progress.belongsTo(Student, { foreignKey: 'studentId' });
Assignment.hasMany(Progress, { foreignKey: 'assignmentId' });
Student.hasMany(Progress, { foreignKey: 'studentId' });

module.exports = {
  User,
  School,
  Template,
  Material,
  Student,
  Assignment,
  Progress
};