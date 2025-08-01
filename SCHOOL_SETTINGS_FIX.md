# School Settings Fix

## Issue Fixed
The 404 error when accessing `/school-settings` was caused by field name mismatches in the server route.

## Problems Identified
1. **Field name mismatches**: Using `school_id` instead of `schoolId`
2. **Field name mismatches**: Using `default_parent_password` instead of `defaultParentPassword`
3. **Field name mismatches**: Using `contact_email` instead of `contactEmail`
4. **Field name mismatches**: Using `contact_phone` instead of `contactPhone`
5. **Missing validation**: No input validation for settings updates
6. **Poor error handling**: Generic error messages

## Changes Made

### Server-Side Fixes (`server/src/routes/school-settings.js`)

1. **Fixed field names**:
   - `school_id` → `schoolId`
   - `default_parent_password` → `defaultParentPassword`
   - `contact_email` → `contactEmail`
   - `contact_phone` → `contactPhone`

2. **Added validation**:
   - Required school name
   - Email format validation
   - Password length validation (minimum 6 characters)

3. **Improved error handling**:
   - Specific validation error messages
   - Sequelize validation error handling
   - Better error responses

### Client-Side Improvements (`client/src/pages/SchoolSettingsPage.js`)

1. **Better error handling**:
   - Shows specific error messages from server
   - User-friendly error alerts
   - Success feedback when settings are saved

## API Endpoints Fixed

### Get School Settings
```
GET /api/v1/school/settings
Authorization: Bearer <token>
```

**Response:**
```json
{
  "settings": {
    "defaultParentPassword": "parent123",
    "schoolName": "Example School",
    "contactEmail": "contact@school.com",
    "contactPhone": "+1234567890"
  }
}
```

### Update School Settings
```
PUT /api/v1/school/settings
Authorization: Bearer <token>

{
  "defaultParentPassword": "newpassword123",
  "schoolName": "Updated School Name",
  "contactEmail": "newcontact@school.com",
  "contactPhone": "+0987654321"
}
```

## Testing Guide

### 1. Access School Settings
- Navigate to `http://localhost:3000/school-settings`
- **Expected**: Page loads without 404 errors
- **Expected**: Current settings are displayed

### 2. Update Settings
- Modify any field (school name, contact info, default password)
- Click "Save Settings"
- **Expected**: Settings saved successfully with confirmation

### 3. Validation Tests
- Try saving without school name → Should show "School name is required"
- Try invalid email format → Should show "Invalid contact email format"
- Try short password (< 6 chars) → Should show password length error

### 4. Default Values
- **Expected**: Default parent password shows current value or "parent123"
- **Expected**: School name shows current school name
- **Expected**: Contact fields show current values or empty

## Expected Behavior After Fix
- ✅ School settings page loads without 404 errors
- ✅ Current settings are fetched and displayed
- ✅ Settings can be updated successfully
- ✅ Proper validation messages for invalid data
- ✅ Success feedback when settings are saved
- ✅ Error handling for network issues

## Security Features
- ✅ School admin authentication required
- ✅ Settings can only be accessed/modified by school admin
- ✅ Input validation and sanitization
- ✅ Proper error handling without exposing sensitive data

## Debugging
If issues persist:
1. Check server logs for detailed error messages
2. Verify user authentication (school admin role)
3. Check database connection and School model
4. Verify API endpoint registration in app.js
5. Check network tab in browser dev tools for API responses 