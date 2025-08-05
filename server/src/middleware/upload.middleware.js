const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const brandingDir = path.join(uploadsDir, 'branding');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(brandingDir)) {
  fs.mkdirSync(brandingDir, { recursive: true });
}

// Configure storage for branding assets
const brandingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, brandingDir);
  },
  filename: (req, file, cb) => {
    const schoolId = req.user?.schoolId || req.body.schoolId || 'unknown';
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `school-${schoolId}-${timestamp}${extension}`);
  }
});

// File filter for branding assets
const brandingFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }

  if (file.size > maxSize) {
    return cb(new Error('File size must be less than 5MB'), false);
  }

  cb(null, true);
};

// Create multer instance for branding uploads
const brandingUpload = multer({
  storage: brandingStorage,
  fileFilter: brandingFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Process uploaded images (resize, optimize)
const processBrandingImage = async (filePath, options = {}) => {
  const {
    width = 300,
    height = 300,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    console.log('Processing image:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Source file does not exist: ${filePath}`);
    }

    const processedPath = filePath.replace(/\.[^/.]+$/, `_processed.${format}`);
    console.log('Processed path:', processedPath);
    
    await sharp(filePath)
      .resize(width, height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFormat(format)
      .jpeg({ quality })
      .toFile(processedPath);

    // Check if processed file was created
    if (!fs.existsSync(processedPath)) {
      throw new Error(`Processed file was not created: ${processedPath}`);
    }

    console.log('Image processed successfully:', processedPath);

    // Remove original file only if processing was successful
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Original file removed:', filePath);
    }
    
    return processedPath;
  } catch (error) {
    console.error('Error processing image:', error);
    console.error('File path:', filePath);
    console.error('Options:', options);
    
    // If processing fails, return the original file path
    if (fs.existsSync(filePath)) {
      console.log('Returning original file path due to processing error');
      return filePath;
    }
    
    throw error;
  }
};

// Middleware for logo upload
const logoUpload = brandingUpload.single('logo');

// Middleware for favicon upload
const faviconUpload = brandingUpload.single('favicon');

// Middleware for multiple branding assets
const brandingAssetsUpload = brandingUpload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]);

module.exports = {
  brandingUpload,
  logoUpload,
  faviconUpload,
  brandingAssetsUpload,
  processBrandingImage,
  brandingDir
};
