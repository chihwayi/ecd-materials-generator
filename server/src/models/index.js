const User = require('./User');
const School = require('./School');
const Template = require('./Template');
const Material = require('./Material');
const Student = require('./Student');
const Assignment = require('./Assignment');
const Progress = require('./Progress');
const Class = require('./Class');
const StudentAssignment = require('./StudentAssignment');
const Message = require('./Message');
const FeeStructure = require('./FeeStructure');
const StudentFee = require('./StudentFee');
const FeePayment = require('./FeePayment');
const Signature = require('./Signature');
const FinancialReport = require('./FinancialReport');

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

// Assignment relationships
Assignment.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
Assignment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Assignment.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
User.hasMany(Assignment, { foreignKey: 'teacherId', as: 'assignments' });
Class.hasMany(Assignment, { foreignKey: 'classId', as: 'assignments' });
School.hasMany(Assignment, { foreignKey: 'schoolId', as: 'assignments' });

// Progress relationships
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

// StudentAssignment relationships
StudentAssignment.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
StudentAssignment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
StudentAssignment.belongsTo(User, { foreignKey: 'gradedBy', as: 'grader' });
Assignment.hasMany(StudentAssignment, { foreignKey: 'assignmentId', as: 'studentAssignments' });
Student.hasMany(StudentAssignment, { foreignKey: 'studentId', as: 'assignments' });

// Message relationships
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
Message.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
Student.hasMany(Message, { foreignKey: 'studentId', as: 'messages' });

// Fee-related associations
FeeStructure.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
School.hasMany(FeeStructure, { foreignKey: 'schoolId', as: 'feeStructures' });

StudentFee.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
StudentFee.belongsTo(FeeStructure, { foreignKey: 'feeStructureId', as: 'feeStructure' });
Student.hasMany(StudentFee, { foreignKey: 'studentId', as: 'fees' });
FeeStructure.hasMany(StudentFee, { foreignKey: 'feeStructureId', as: 'studentFees' });

FeePayment.belongsTo(StudentFee, { foreignKey: 'studentFeeId', as: 'studentFee' });
FeePayment.belongsTo(User, { foreignKey: 'recordedBy', as: 'recordedByUser' });
StudentFee.hasMany(FeePayment, { foreignKey: 'studentFeeId', as: 'payments' });
User.hasMany(FeePayment, { foreignKey: 'recordedBy', as: 'recordedPayments' });

// Signature associations
Signature.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Signature.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
User.hasMany(Signature, { foreignKey: 'userId', as: 'signatures' });
School.hasMany(Signature, { foreignKey: 'schoolId', as: 'signatures' });

// Financial Report associations
FinancialReport.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
FinancialReport.belongsTo(User, { foreignKey: 'generatedBy', as: 'generatedByUser' });
School.hasMany(FinancialReport, { foreignKey: 'schoolId', as: 'financialReports' });
User.hasMany(FinancialReport, { foreignKey: 'generatedBy', as: 'generatedReports' });

module.exports = {
  User,
  School,
  Template,
  Material,
  Student,
  Assignment,
  Progress,
  Class,
  StudentAssignment,
  Message,
  FeeStructure,
  StudentFee,
  FeePayment,
  Signature,
  FinancialReport
};