const express = require('express');
const multer = require('multer');
const imageConfig = require('../config/imageConfig');
const path = require('path');
const imageController = require('../controllers/MeterImageController');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageConfig.IMAGE_PATH_SERVER);
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