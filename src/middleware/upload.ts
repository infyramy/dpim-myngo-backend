import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directories if they don't exist
const businessUploadsDir = path.join(__dirname, '../../uploads/businesses');
const productUploadsDir = path.join(__dirname, '../../uploads/products');

if (!fs.existsSync(businessUploadsDir)) {
  fs.mkdirSync(businessUploadsDir, { recursive: true });
}

if (!fs.existsSync(productUploadsDir)) {
  fs.mkdirSync(productUploadsDir, { recursive: true });
}

// Configure multer storage for businesses
const businessStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, businessUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Configure multer storage for products
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer for businesses
const businessUpload = multer({
  storage: businessStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 3 // Maximum 3 files
  },
  fileFilter: fileFilter
});

// Configure multer for products
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files for products
  },
  fileFilter: fileFilter
});

// Export different upload configurations
export const uploadBusinessImages = businessUpload.array('images', 3);
export const uploadProductImages = productUpload.array('images', 5);

export const uploadSingle = businessUpload.single('image');
export const uploadMultiple = businessUpload.array('files', 10); 