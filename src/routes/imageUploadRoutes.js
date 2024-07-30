const express = require('express');
const multer = require('multer');
const imagePath = require('../config/imageConfig')
const path = require('path');
const imageController = require('../controllers/MeterImageController');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath.IMAGE_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/uploadMeterImages', upload.array('images', 10), imageController.uploadImages);
router.post('/fetchMeterImages',imageController.fetchImagesByMeterInfoID);
router.post('/deleteImage',imageController.softDeleteImage);

module.exports = router;