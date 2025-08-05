# 🎨 White-Labeling & School Branding Implementation

## Overview

This implementation provides a comprehensive white-labeling system that allows schools to customize their branding and appearance within the ECD Materials Generator platform. The system supports both **System Admin** and **School Admin** workflows for managing branding.

## 🏗️ Architecture

### Hybrid Approach
- **System Admin**: Handles initial school registration with logo upload during setup
- **School Admin**: Self-service portal for ongoing branding customization
- **Dynamic Theming**: Real-time application of school-specific branding

## 📊 Database Schema

### New School Model Fields
```sql
-- Branding and Customization Fields
logoUrl VARCHAR(255) NULL
primaryColor VARCHAR(7) DEFAULT '#2563eb'
secondaryColor VARCHAR(7) DEFAULT '#1d4ed8'
accentColor VARCHAR(7) DEFAULT '#fbbf24'
customFont VARCHAR(100) DEFAULT 'Inter'
customDomain VARCHAR(255) UNIQUE NULL
brandingEnabled BOOLEAN DEFAULT true
customCss TEXT NULL
faviconUrl VARCHAR(255) NULL
schoolMotto VARCHAR(255) NULL
customHeaderText VARCHAR(255) NULL
```

## 🔧 Backend Implementation

### 1. Enhanced School Model (`server/src/models/School.js`)
- Added branding fields with validation
- Color format validation (hex codes)
- Default branding values

### 2. Upload Middleware (`server/src/middleware/upload.middleware.js`)
- **Logo Upload**: 300x300px, optimized for web
- **Favicon Upload**: 32x32px, high quality
- **Image Processing**: Sharp library for optimization
- **File Validation**: JPEG, PNG, GIF, WebP support
- **Size Limits**: 5MB max file size

### 3. API Endpoints

#### School Settings Routes (`server/src/routes/school-settings.js`)
```javascript
GET /school/settings          // Get school settings
PUT /school/settings          // Update school settings
POST /school/upload-logo      // Upload school logo
POST /school/upload-favicon   // Upload school favicon
GET /school/branding          // Get branding data
PUT /school/custom-css        // Update custom CSS
```

#### Admin Routes (`server/src/routes/admin.js`)
```javascript
GET /admin/schools            // Get all schools with branding
POST /admin/schools           // Create school with branding
POST /admin/schools/:id/logo  // Upload logo (system admin)
POST /admin/schools/:id/favicon // Upload favicon (system admin)
PUT /admin/schools/:id/branding // Update branding (system admin)
```

## 🎨 Frontend Implementation

### 1. Dynamic Header Component (`client/src/components/common/Header.tsx`)
- **Real-time Branding**: Fetches and applies school branding
- **Logo Display**: Shows school logo or default icon
- **Color Scheme**: Dynamic CSS variables for colors
- **Custom Text**: School name and motto in header
- **Font Support**: Custom font families

### 2. School Settings Page (`client/src/pages/SchoolSettingsPage.js`)
- **Comprehensive Form**: All branding options
- **Color Picker**: Visual color selection
- **File Upload**: Logo and favicon upload
- **Live Preview**: Real-time branding preview
- **Validation**: Client-side validation

### 3. System Admin Management (`client/src/pages/admin/SchoolManagementPage.tsx`)
- **Branding Fields**: Extended school creation/editing
- **Logo Management**: Upload and manage school logos
- **Color Configuration**: Set school color schemes
- **Bulk Operations**: Manage multiple schools

## 🚀 Features

### ✅ Implemented Features

1. **Logo Management**
   - Upload school logos (300x300px)
   - Automatic image optimization
   - Multiple format support (JPEG, PNG, GIF, WebP)

2. **Color Customization**
   - Primary color (header background)
   - Secondary color (gradient)
   - Accent color (highlights)
   - Hex color validation

3. **Text Customization**
   - Custom header text
   - School motto
   - Custom font selection

4. **Favicon Support**
   - Upload school favicon (32x32px)
   - Automatic optimization

5. **Branding Toggle**
   - Enable/disable custom branding
   - Fallback to default theme

6. **File Upload System**
   - Secure file uploads
   - Image processing and optimization
   - File size and type validation

### 🔄 Workflow

#### System Admin Workflow
1. **Create School**: System admin creates school with basic info
2. **Upload Logo**: Upload school logo during creation
3. **Set Branding**: Configure colors and custom text
4. **Activate**: Enable branding for the school

#### School Admin Workflow
1. **Access Settings**: Navigate to school settings
2. **Upload Assets**: Upload logo and favicon
3. **Customize Colors**: Set primary, secondary, accent colors
4. **Add Text**: Customize header text and motto
5. **Preview**: See changes in real-time
6. **Save**: Apply branding across the platform

## 🎯 Benefits

### For System Admins
- ✅ **Professional Onboarding**: Ensure quality branding during setup
- ✅ **Centralized Control**: Manage all school branding
- ✅ **Consistency**: Maintain platform standards

### For School Admins
- ✅ **Self-Service**: Update branding without system admin
- ✅ **Flexibility**: Customize appearance as needed
- ✅ **Real-time Updates**: See changes immediately

### For Users
- ✅ **Familiar Experience**: School-specific branding
- ✅ **Professional Look**: Custom logos and colors
- ✅ **Brand Recognition**: School identity throughout platform

## 🔧 Technical Details

### Image Processing
```javascript
// Logo processing
const processedPath = await processBrandingImage(req.file.path, {
  width: 300,
  height: 300,
  quality: 85
});

// Favicon processing
const processedPath = await processBrandingImage(req.file.path, {
  width: 32,
  height: 32,
  quality: 90
});
```

### Dynamic CSS
```javascript
// Apply branding styles
const styles = {
  headerBg: `bg-gradient-to-r from-[${primaryColor}] via-[${secondaryColor}] to-[${primaryColor}]`,
  textColor: 'text-white',
  customFont: schoolBranding.customFont ? `font-['${schoolBranding.customFont}']` : ''
};
```

### Database Migration
```javascript
// Migration: 20250130000004-add-school-branding.js
await queryInterface.addColumn('Schools', 'logoUrl', {
  type: Sequelize.STRING,
  allowNull: true
});
// ... additional branding fields
```

## 🧪 Testing

### Manual Testing Steps

1. **System Admin Flow**
   ```bash
   # Create school with branding
   POST /admin/schools
   {
     "name": "Test School",
     "primaryColor": "#2563eb",
     "secondaryColor": "#1d4ed8",
     "accentColor": "#fbbf24"
   }
   
   # Upload logo
   POST /admin/schools/{id}/logo
   # Upload favicon
   POST /admin/schools/{id}/favicon
   ```

2. **School Admin Flow**
   ```bash
   # Get branding data
   GET /school/branding
   
   # Update settings
   PUT /school/settings
   {
     "primaryColor": "#dc2626",
     "customHeaderText": "My School"
   }
   
   # Upload logo
   POST /school/upload-logo
   ```

3. **Frontend Testing**
   - Login as school admin
   - Navigate to Settings
   - Upload logo and favicon
   - Change colors
   - Verify header updates

## 📈 Future Enhancements

### Planned Features
1. **Custom CSS Editor**: Advanced CSS customization
2. **Theme Templates**: Pre-built color schemes
3. **Brand Guidelines**: Upload brand guidelines
4. **Multi-language Support**: Localized branding
5. **Analytics**: Branding usage analytics

### Technical Improvements
1. **CDN Integration**: Faster image delivery
2. **Image Optimization**: WebP conversion
3. **Caching**: Branding data caching
4. **Performance**: Lazy loading of branding assets

## 🛠️ Maintenance

### Database Maintenance
```sql
-- Check branding usage
SELECT name, logoUrl, brandingEnabled 
FROM Schools 
WHERE brandingEnabled = true;

-- Clean up unused logos
DELETE FROM uploads WHERE school_id IS NULL;
```

### File Management
```bash
# Check upload directory
ls -la server/uploads/branding/

# Clean up old files
find server/uploads/branding/ -mtime +30 -delete
```

## 📝 Conclusion

This white-labeling implementation provides a robust, scalable solution for school branding customization. The hybrid approach ensures quality control while providing flexibility for schools to manage their own branding. The system is designed to be extensible and can accommodate future enhancements as needed.

### Key Success Metrics
- ✅ **Scalability**: Supports unlimited schools
- ✅ **Performance**: Optimized image processing
- ✅ **Security**: Secure file uploads
- ✅ **User Experience**: Intuitive interface
- ✅ **Maintainability**: Clean, documented code 