const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Multer storage to save locally in the "uploads" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure the 'uploads' folder exists in your backend root
  },
  filename: function (req, file, cb) {
    // Give the file a unique name using the current timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST /upload
router.post('/', authMiddleware, upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the path so the frontend can save it to the Tenant's documentUrl field
    res.status(200).json({ fileUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error uploading file' });
  }
});

module.exports = router;