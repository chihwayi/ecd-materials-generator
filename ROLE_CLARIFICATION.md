# Role Clarification and Separation of Concerns

## Overview
This document clarifies the distinct roles and responsibilities for School Administrators and Teachers in the ECD Materials Generator system.

## Role Definitions

### 🏫 **School Administrator**
**Primary Responsibility**: Student and Class Management

#### ✅ **What School Admins CAN Do:**
- **Student Management**:
  - Create student accounts
  - View all students in the school
  - Assign students to classes (single or bulk)
  - Monitor student-class assignments
  - View student progress and activities

- **Class Management**:
  - Create and manage classes
  - Assign teachers to classes
  - View class rosters
  - Monitor class assignments

- **Teacher Management**:
  - Create teacher accounts
  - View and manage teachers
  - Assign teachers to classes

- **Monitoring & Analytics**:
  - View assignment results (created by teachers)
  - Monitor student activities
  - View school-wide analytics
  - Track assignment completion rates

#### ❌ **What School Admins CANNOT Do:**
- Create homework assignments
- Grade student work
- Create educational materials
- Modify assignment content

### 👨‍🏫 **Teacher**
**Primary Responsibility**: Educational Content and Assignment Creation

#### ✅ **What Teachers CAN Do:**
- **Assignment Creation**:
  - Create homework assignments for their classes
  - Set due dates and instructions
  - Grade student submissions
  - Provide feedback on student work

- **Class Management**:
  - View students in their assigned classes
  - Monitor student progress
  - Track assignment completion

- **Educational Content**:
  - Create educational materials
  - Design learning activities
  - Customize assignments for their classes

#### ❌ **What Teachers CANNOT Do:**
- Assign students to classes
- Create teacher accounts
- Access school-wide analytics
- Manage other teachers

## System Architecture

### **Student Assignment Flow**
```
1. School Admin creates student accounts
2. School Admin creates classes and assigns teachers
3. School Admin assigns students to classes
4. Teachers create assignments for their classes
5. Students complete assignments
6. Teachers grade assignments
7. School Admin monitors results
```

### **Assignment Creation Flow**
```
1. Teacher logs into their account
2. Teacher selects their class
3. Teacher creates assignment with title, description, instructions, due date
4. System automatically assigns assignment to all students in the class
5. Students/parents can view and submit assignments
6. Teacher grades submissions
7. School Admin can monitor results
```

## Updated Features

### **School Admin Features**

#### **Student Assignment Management** (`/student-assignment-management`)
- **Bulk Student Assignment**: Assign multiple students to classes at once
- **Individual Student Assignment**: Assign students one by one
- **Unassigned Students View**: See all students not assigned to any class
- **Class Roster View**: See students assigned to each class
- **Assignment Statistics**: Track assignment completion rates

#### **Assignment Monitoring** (`/assignments`)
- **View All Assignments**: See assignments created by teachers
- **Monitor Progress**: Track assignment completion rates
- **Teacher Information**: See which teacher created each assignment
- **No Creation Access**: Cannot create homework assignments

### **Teacher Features**

#### **Assignment Creation** (`/create-assignment`)
- **Create Homework**: Design assignments for their classes
- **Set Instructions**: Provide detailed assignment instructions
- **Set Due Dates**: Establish assignment deadlines
- **Auto-Assignment**: Automatically assigned to all students in class

#### **Assignment Management** (`/assignments`)
- **View Their Assignments**: See assignments they created
- **Grade Submissions**: Review and grade student work
- **Track Progress**: Monitor student completion rates
- **Provide Feedback**: Give feedback on student submissions

## API Endpoints

### **School Admin Endpoints**
```
GET /api/v1/school-admin/students/unassigned - Get unassigned students
POST /api/v1/school-admin/students/bulk-assign - Bulk assign students
GET /api/v1/school-admin/classes/:classId/students - Get class students
GET /api/v1/assignments/school-admin - View all assignments (monitoring only)
```

### **Teacher Endpoints**
```
GET /api/v1/teacher/classes - Get teacher's classes
POST /api/v1/assignments - Create assignment (teachers only)
GET /api/v1/assignments/teacher - Get teacher's assignments
POST /api/v1/assignments/grade/:id - Grade assignment
```

## User Interface Changes

### **School Admin Dashboard**
- **Removed**: "Create Assignment" button
- **Added**: "Manage Student Assignments" button
- **Updated**: Assignment page shows monitoring view only
- **Added**: Link to student assignment management

### **Teacher Dashboard**
- **Kept**: "Create Assignment" button
- **Updated**: Assignment page shows creation and management
- **Enhanced**: Assignment creation form

## Security and Access Control

### **Role-Based Access**
- **School Admin**: Can assign students to classes, monitor assignments
- **Teacher**: Can create assignments, grade submissions
- **Parent**: Can view and submit assignments for their children
- **Student**: Can view assignments (through parent account)

### **Data Isolation**
- **School Admin**: Can see all data within their school
- **Teacher**: Can only see their own classes and assignments
- **Parent**: Can only see their children's assignments

## Testing Scenarios

### **School Admin Testing**
1. **Student Assignment**:
   - Create student accounts
   - Assign students to classes (bulk and individual)
   - Verify students appear in correct classes

2. **Assignment Monitoring**:
   - View assignments created by teachers
   - Monitor completion rates
   - Cannot create assignments

### **Teacher Testing**
1. **Assignment Creation**:
   - Create assignments for their classes
   - Set due dates and instructions
   - Verify assignment appears for students

2. **Assignment Management**:
   - Grade student submissions
   - Provide feedback
   - Track student progress

## Benefits of This Separation

### **✅ Clear Responsibilities**
- School admins focus on administrative tasks
- Teachers focus on educational content
- Reduced confusion about who does what

### **✅ Better Security**
- Teachers can't assign students to classes
- School admins can't create educational content
- Proper role-based access control

### **✅ Improved Workflow**
- Clear separation of administrative and educational tasks
- Streamlined assignment creation process
- Better monitoring and analytics

### **✅ Scalability**
- Easy to add new roles (e.g., department heads)
- Clear permission boundaries
- Maintainable codebase

## Future Enhancements

### **Potential Features**
- **Department Heads**: Monitor specific departments
- **Curriculum Coordinators**: Create assignment templates
- **Parent Portal**: Direct parent access to assignments
- **Student Portal**: Direct student access (age-appropriate)

### **Analytics Enhancements**
- **Assignment Analytics**: Detailed completion reports
- **Student Progress Tracking**: Individual student analytics
- **Teacher Performance**: Assignment effectiveness metrics
- **School-wide Reports**: Comprehensive school analytics 