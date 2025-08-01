# Create Assignment Page Fix

## Issue Fixed
The "Create Assignment" button was redirecting to `/create-assignment` but the route was restricted to teachers only, causing school admins to be redirected to the dashboard.

## Problems Identified
1. **Route restriction**: `/create-assignment` route only allowed `teacher` role
2. **Missing school admin access**: School admins couldn't create assignments
3. **Wrong endpoint**: Page was trying to fetch classes from `/teacher/classes`
4. **Assignment creation restriction**: Assignment creation endpoint only allowed teachers

## Changes Made

### Server-Side Fixes

#### `server/src/routes/assignments.js`
1. **Updated role access**:
   - Changed from `teacher` only to `teacher` and `school_admin`
   - Added role-based class verification logic

2. **Enhanced class verification**:
   - **Teachers**: Can only create assignments for their own classes
   - **School Admins**: Can create assignments for any class in their school

3. **Fixed teacher assignment**:
   - **Teachers**: Assignment created with their own teacher ID
   - **School Admins**: Assignment created with the class teacher's ID

### Client-Side Fixes

#### `client/src/App.tsx`
1. **Updated route protection**:
   - Changed from `allowedRoles={['teacher']}` 
   - To `allowedRoles={['teacher', 'school_admin']}`

#### `client/src/pages/CreateAssignmentPage.js`
1. **Added role-based endpoint selection**:
   - Checks user role from localStorage
   - Uses `/teacher/classes` for teachers
   - Uses `/classes` for school admins

## API Endpoints

### 1. Create Assignment
```
POST /api/v1/assignments
Authorization: Bearer <token>
Role: teacher, school_admin

{
  "title": "Math Assignment",
  "description": "Complete exercises 1-10",
  "instructions": "Show your work",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "classId": "class-uuid"
}
```

**Response:**
```json
{
  "message": "Assignment created and assigned to 15 students",
  "assignment": {
    "id": "uuid",
    "title": "Math Assignment",
    "description": "Complete exercises 1-10",
    "teacherId": "teacher-uuid",
    "classId": "class-uuid",
    "schoolId": "school-uuid"
  },
  "assignedCount": 15
}
```

### 2. Get Classes (Teacher)
```
GET /api/v1/teacher/classes
Authorization: Bearer <token>
Role: teacher
```

### 3. Get Classes (School Admin)
```
GET /api/v1/classes
Authorization: Bearer <token>
Role: school_admin
```

## Testing Guide

### 1. Test as School Admin
- Navigate to `http://localhost:3000/assignments`
- Click "Create Assignment" button
- **Expected**: Page loads without redirect to dashboard
- **Expected**: Can select any class in school
- **Expected**: Assignment created successfully

### 2. Test as Teacher
- Log in as a teacher
- Navigate to `/create-assignment`
- **Expected**: Can only see their own classes
- **Expected**: Assignment created with teacher's ID

### 3. Test Assignment Creation
1. **Fill in the form**:
   - Title: "Test Assignment"
   - Description: "Test description"
   - Instructions: "Test instructions"
   - Due Date: Select a future date
   - Class: Select a class

2. **Click "Create & Assign to All Students"**
3. **Expected**: Success message with assigned count
4. **Expected**: Form resets after successful creation

### 4. Test Validation
- Try creating assignment without required fields
- Try selecting non-existent class
- **Expected**: Proper error messages

## Expected Behavior After Fix

### ✅ **Success Indicators**
- Create Assignment page loads for both teachers and school admins
- No redirect to dashboard
- Proper class selection based on role
- Assignment creation works for both roles
- Success messages display correctly

### ❌ **Failure Indicators**
- Redirect to dashboard
- 403 Forbidden errors
- Empty class dropdown
- Assignment creation fails
- Wrong teacher assigned to assignment

## Security Features

### ✅ **Authorization**
- Role-based access control
- Teachers can only create assignments for their classes
- School admins can create assignments for any class in school
- Proper authentication verification

### ✅ **Validation**
- Required field validation
- Class existence verification
- School ownership verification
- Teacher ownership verification (for teachers)

## Role-Based Behavior

### **Teacher Role**
- Can only see their own classes in dropdown
- Assignment created with their teacher ID
- Can only create assignments for their classes

### **School Admin Role**
- Can see all classes in their school
- Assignment created with class teacher's ID
- Can create assignments for any class in school

## Debugging Steps (if still failing)

### 1. Check User Role
```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem('user')));
```

### 2. Check Route Access
```javascript
// Verify route is accessible
window.location.href = '/create-assignment';
```

### 3. Check API Endpoints
```bash
# Test class endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/v1/classes

# Test assignment creation
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test","classId":"class-uuid"}' \
     http://localhost:5000/api/v1/assignments
```

## Next Steps
Once the fix is confirmed working:
1. Test assignment viewing and management
2. Test assignment submission (parent role)
3. Test assignment grading (teacher role)
4. Verify all assignment-related features work correctly 