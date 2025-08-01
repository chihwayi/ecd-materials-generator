# Students Page Fix

## Issue Fixed
The 403 Forbidden error when accessing `/students` was caused by the students service trying to access teacher-only endpoints when logged in as a school admin.

## Problems Identified
1. **Role-based endpoint mismatch**: Students service was hardcoded to use `/teacher/students`
2. **Missing school admin endpoints**: No endpoints for school admins to view all students
3. **No role detection**: Service didn't check user role to determine correct endpoint
4. **Fallback to mock data**: Service was falling back to mock data instead of real API
5. **Sequelize EagerLoadingError**: Multiple User associations without proper aliases

## Changes Made

### Server-Side Fixes

#### `server/src/routes/school-admin.js`
1. **Added school admin students endpoints**:
   - `GET /school-admin/students` - Get all students in school
   - `GET /school-admin/students/:id` - Get individual student details
   - `GET /school-admin/students/:id/progress` - Get student progress
   - `POST /school-admin/students/:id/progress` - Add progress record

2. **Added proper authentication and authorization**:
   - School admin role verification
   - Student belongs to school verification
   - Proper error handling

3. **Fixed Sequelize associations**:
   - Added proper `as` aliases for User associations
   - Included both `assignedTeacher` and `parent` associations
   - Fixed EagerLoadingError by specifying correct association aliases

### Client-Side Fixes

#### `client/src/services/students.service.ts`
1. **Added role-based endpoint selection**:
   - Checks user role from localStorage
   - Uses `/teacher/students` for teachers
   - Uses `/school-admin/students` for school admins

2. **Updated all methods to use role-based endpoints**:
   - `getStudents()`
   - `getStudentById()`
   - `getStudentProgress()`
   - `addProgressRecord()`

3. **Updated data mapping**:
   - Handle parent information from User association
   - Fallback to direct parent fields if association not available

## API Endpoints Added

### Get All Students (School Admin)
```
GET /api/v1/school-admin/students
Authorization: Bearer <token>
```

**Response:**
```json
{
  "students": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "age": 6,
      "parentName": "Jane Doe",
      "parentEmail": "jane@example.com",
      "parentPhone": "+1234567890",
      "class": {
        "name": "Grade 1A",
        "grade": "1"
      },
      "assignedTeacher": {
        "firstName": "Teacher",
        "lastName": "Name",
        "email": "teacher@school.com"
      },
      "parent": {
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com"
      }
    }
  ]
}
```

### Get Student Details (School Admin)
```
GET /api/v1/school-admin/students/:id
Authorization: Bearer <token>
```

### Get Student Progress (School Admin)
```
GET /api/v1/school-admin/students/:id/progress
Authorization: Bearer <token>
```

### Add Progress Record (School Admin)
```
POST /api/v1/school-admin/students/:id/progress
Authorization: Bearer <token>

{
  "activity": "Math Activity",
  "type": "digital",
  "score": 85,
  "notes": "Great work on addition!"
}
```

## Testing Guide

### 1. Access Students Page as School Admin
- Navigate to `http://localhost:3000/students`
- **Expected**: Page loads without 403 errors
- **Expected**: Real student data is displayed (not mock data)

### 2. View Student Details
- Click on any student card
- **Expected**: Student details page loads
- **Expected**: Real student information is displayed

### 3. View Student Progress
- Navigate to student progress section
- **Expected**: Progress records are displayed
- **Expected**: Can add new progress records

### 4. Test as Teacher
- Log in as a teacher
- Navigate to `/students`
- **Expected**: Only teacher's assigned students are shown
- **Expected**: Uses `/teacher/students` endpoint

### 5. Test as School Admin
- Log in as a school admin
- Navigate to `/students`
- **Expected**: All students in school are shown
- **Expected**: Uses `/school-admin/students` endpoint

## Expected Behavior After Fix
- ✅ Students page loads without 403 errors
- ✅ Real student data is displayed (no more mock data)
- ✅ Role-based access (teachers see their students, admins see all)
- ✅ Proper error handling for unauthorized access
- ✅ Student details and progress functionality works
- ✅ Endpoints use correct authentication
- ✅ No Sequelize EagerLoadingError

## Security Features
- ✅ Role-based access control
- ✅ School admin can only see students in their school
- ✅ Proper authentication verification
- ✅ Student verification (must belong to school)
- ✅ Input validation for progress records

## Debugging
If issues persist:
1. Check user role in localStorage
2. Verify authentication token
3. Check server logs for detailed error messages
4. Verify API endpoint registration in app.js
5. Check network tab in browser dev tools for API responses
6. Ensure user has proper school admin role
7. Check Sequelize associations in models/index.js 