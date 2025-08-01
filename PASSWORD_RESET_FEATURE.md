# Password Reset Feature for System Admins

## Overview
This feature allows system administrators to reset passwords for any user in the system through the admin dashboard.

## Features

### Server-Side Implementation
- **Endpoint**: `POST /admin/users/reset-password`
- **Authentication**: System admin only
- **Functionality**: 
  - Reset password for any user
  - Auto-generate random password if none provided
  - Return temporary password for auto-generated passwords
  - Hash passwords securely using bcrypt

### Client-Side Implementation
- **Location**: `/admin/users` page
- **UI**: Password reset button in user actions
- **Modal**: Dedicated password reset modal with:
  - User information display
  - Password input field (optional)
  - Auto-generate password button
  - Show/hide password toggle
  - Copy to clipboard functionality
  - Success confirmation with temporary password display

## Usage

### For System Admins
1. Navigate to `/admin/users`
2. Find the user whose password needs to be reset
3. Click the "Reset Password" button in the Actions column
4. In the modal:
   - Leave password field blank for auto-generated password
   - Or enter a custom password
   - Click "Generate Password" for a random password
   - Click "Reset Password" to confirm
5. Copy the temporary password and share it with the user securely

### Security Features
- Only system admins can access this feature
- Passwords are hashed using bcrypt with salt rounds of 12
- Temporary passwords are generated using crypto.randomBytes
- All password operations are logged for audit purposes

## API Endpoints

### Reset Password
```
POST /admin/users/reset-password
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user-id",
  "newPassword": "optional-custom-password"
}
```

**Response:**
```json
{
  "message": "Password reset successfully",
  "temporaryPassword": "generated-password-if-auto-generated",
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

### Get Users for Password Reset
```
GET /admin/users/reset-password?role=teacher&search=john
Authorization: Bearer <token>
```

**Response:**
```json
{
  "users": [
    {
      "id": "user-id",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role": "teacher",
      "is_active": true
    }
  ]
}
```

## Components

### PasswordResetModal.tsx
- Handles the password reset UI
- Provides password generation and validation
- Shows success confirmation with temporary password
- Includes copy-to-clipboard functionality

### UserManagementPage.tsx
- Integrates password reset button in user actions
- Manages password reset modal state
- Handles user selection for password reset

## Error Handling
- User not found: 404 error
- Unauthorized access: 403 error
- Server errors: 500 error with descriptive messages
- Client-side error handling with toast notifications

## Future Enhancements
- Email notification to user when password is reset
- Password strength validation
- Bulk password reset functionality
- Password reset history tracking
- Force password change on next login 