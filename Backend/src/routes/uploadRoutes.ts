import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, sellerOnly } from '../middleware/auth';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads', 'properties');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post(
  '/property-images',
  protect,
  sellerOnly,
  upload.array('images', 10),
  (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
         res.status(400).json({ message: 'No files uploaded' });
         return;
      }
      
      const filePaths = files.map(file => `http://localhost:3002/uploads/properties/${file.filename}`);
      res.json(filePaths);
    } catch (error) {
      console.error('Upload error', error);
      res.status(500).json({ message: 'Error uploading files' });
    }
  }
);

export default router;
