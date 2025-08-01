# Assignments Role-Based Access Fix

## Issue Fixed
The 403 Forbidden error when accessing `/assignments` was caused by the endpoint only allowing teachers, but the user was logged in as a school admin.

## Problems Identified
1. **Role restriction**: `/assignments/teacher` endpoint only allowed `teacher` role
2. **Missing school admin endpoint**: No endpoint for school admins to view assignments
3. **No role detection**: Frontend didn't check user role to use correct endpoint
4. **Generic page name**: Page was named "TeacherAssignmentsPage" but used by multiple roles

## Changes Made

### Server-Side Fixes

#### `server/src/routes/assignments.js`
1. **Added school admin endpoint**:
   - `GET /assignments/school-admin` - Get all assignments in school
   - Includes teacher information for school admin view
   - School-level data isolation
   - Proper authentication and authorization

2. **Enhanced data structure**:
   - Added teacher information to school admin response
   - Maintained existing teacher endpoint functionality
   - Proper error handling for both roles

### Client-Side Fixes

#### `client/src/pages/TeacherAssignmentsPage.js`
1. **Added role-based endpoint selection**:
   - Checks user role from localStorage
   - Uses `/assignments/teacher` for teachers
   - Uses `/assignments/school-admin` for school admins

2. **Updated UI text**:
   - Changed "My Assignments" to "Assignments"
   - Updated description to be more generic
   - Updated empty state message

## API Endpoints

### 1. Teacher Assignments
```
GET /api/v1/assignments/teacher
Authorization: Bearer <token>
Role: teacher
```

**Response:**
```json
{
  "assignments": [
    {
      "id": "uuid",
      "title": "Math Assignment",
      "description": "Complete exercises 1-10",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "class": {
        "name": "Grade 1A",
        "grade": "1"
      },
      "studentAssignments": [
        {
          "id": "uuid",
          "status": "assigned",
          "student": {
            "firstName": "John",
            "lastName": "Doe"
          }
        }
      ]
    }
  ]
}
```

### 2. School Admin Assignments
```
GET /api/v1/assignments/school-admin
Authorization: Bearer <token>
Role: school_admin
```

**Response:**
```json
{
  "assignments": [
    {
      "id": "uuid",
      "title": "Math Assignment",
      "description": "Complete exercises 1-10",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "class": {
        "name": "Grade 1A",
        "grade": "1"
      },
      "teacher": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@school.com"
      },
      "studentAssignments": [
        {
          "id": "uuid",
          "status": "assigned",
          "student": {
            "firstName": "John",
            "lastName": "Doe"
          }
        }
      ]
    }
  ]
}
```

## Testing Guide

### 1. Test as School Admin
- Navigate to `http://localhost:3000/assignments`
- **Expected**: Page loads without 403 errors
- **Expected**: All assignments in school are displayed
- **Expected**: Teacher information is shown for each assignment

### 2. Test as Teacher
- Log in as a teacher
- Navigate to `/assignments`
- **Expected**: Only teacher's assignments are shown
- **Expected**: Uses `/assignments/teacher` endpoint

### 3. Test API Endpoints
1. **Open Browser Dev Tools** (F12)
2. **Go to Network tab**
3. **Refresh the page**
4. **Look for**: `GET /api/v1/assignments/school-admin` (for school admin)
5. **Expected**: Status 200 (not 403)
6. **Expected**: Response contains assignment data with teacher info

### 4. Check Server Logs
1. **Look at terminal/server logs**
2. **Expected**: No 403 errors for assignments
3. **Expected**: Successful database queries

## Expected Behavior After Fix

### ✅ **Success Indicators**
- Assignments page loads without 403 errors
- Role-appropriate assignments are displayed
- Teacher information shown for school admin view
- Proper endpoint selection based on user role
- No authentication errors

### ❌ **Failure Indicators**
- 403 Forbidden errors
- Empty assignment lists
- Wrong endpoint being called
- Missing teacher information

## Security Features

### ✅ **Authorization**
- Role-based access control
- School-level data isolation
- Teacher can only see their assignments
- School admin can see all assignments in school

### ✅ **Validation**
- User role verification
- School ownership verification
- Proper authentication middleware
- Secure endpoint access

## Debugging Steps (if still failing)

### 1. Check User Role
```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem('user')));
```

### 2. Check API Endpoint
```bash
# Test the endpoint directly
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/v1/assignments/school-admin
```

### 3. Verify Route Registration
```bash
# Check if route is registered
grep -r "assignments" server/src/app.js
```

### 4. Check Database
```bash
# Verify assignments exist
psql -h localhost -U postgres -d ecd_materials -c "SELECT * FROM \"Assignment\" LIMIT 5;"
```

## Next Steps
Once the fix is confirmed working:
1. Test assignment creation functionality
2. Test assignment submission (parent role)
3. Test assignment grading (teacher role)
4. Verify all assignment-related features work correctly
5. Consider renaming component to be more generic 