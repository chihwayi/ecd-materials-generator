const User = require('./User');
const School = require('./School');
const Template = require('./Template');
const Material = require('./Material');
const Student = require('./Student');
const Assignment = require('./Assignment');
const Progress = require('./Progress');
const Class = require('./Class');
const StudentAssignment = require('./StudentAssignment');

// Define associations
User.belongsTo(School, { foreignKey: 'schoolId' });
School.hasMany(User, { foreignKey: 'schoolId' });

Template.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
User.hasMany(Template, { foreignKey: 'creatorId', as: 'templates' });

Material.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
User.hasMany(Material, { foreignKey: 'creatorId', as: 'materials' });

Student.belongsTo(School, { foreignKey: 'schoolId' });
Student.belongsTo(User, { foreignKey: 'teacherId', as: 'assignedTeacher' });
School.hasMany(Student, { foreignKey: 'schoolId' });
User.hasMany(Student, { foreignKey: 'teacherId', as: 'assignedStudents' });

Assignment.belongsTo(Material, { foreignKey: 'materialId' });
Assignment.belongsTo(User, { foreignKey: 'teacherId', as: 'assigningTeacher' });
Material.hasMany(Assignment, { foreignKey: 'materialId' });
User.hasMany(Assignment, { foreignKey: 'teacherId', as: 'createdAssignments' });

Progress.belongsTo(Assignment, { foreignKey: 'assignmentId' });
Progress.belongsTo(Student, { foreignKey: 'studentId' });
Assignment.hasMany(Progress, { foreignKey: 'assignmentId' });
Student.hasMany(Progress, { foreignKey: 'studentId' });

// Class associations
Class.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
Class.belongsTo(User, { foreignKey: 'teacherId', as: 'classTeacher' });
School.hasMany(Class, { foreignKey: 'schoolId', as: 'classes' });
User.hasMany(Class, { foreignKey: 'teacherId', as: 'teachingClasses' });

// Update Student to belong to Class
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });

// Student-Parent relationship
Student.belongsTo(User, { foreignKey: 'parentId', as: 'parent' });
User.hasMany(Student, { foreignKey: 'parentId', as: 'children' });

// Assignment relationships
Assignment.belongsTo(User, { foreignKey: 'teacherId', as: 'assignmentCreator' });
Assignment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Assignment.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

// StudentAssignment relationships
StudentAssignment.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
StudentAssignment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
StudentAssignment.belongsTo(User, { foreignKey: 'gradedBy', as: 'grader' });
Assignment.hasMany(StudentAssignment, { foreignKey: 'assignmentId', as: 'studentAssignments' });
Student.hasMany(StudentAssignment, { foreignKey: 'studentId', as: 'assignments' });

module.exports = {
  User,
  School,
  Template,
  Material,
  Student,
  Assignment,
  Progress,
  Class,
  StudentAssignment
};