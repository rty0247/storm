const sequelize = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imageConfig = require('../config/imageConfig');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageConfig.IMAGE_PATH_SERVER);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

exports.uploadImages = async (req, res) => {
  try {
    console.log('Starting image upload process...');
    const meterInfoID = req.body.meterInfoID || null;
    const files = req.files;

    if (!files || files.length === 0) {
      console.log('No files were uploaded.');
      return res.status(400).json({ status: 'error', message: 'No files were uploaded.' });
    }

    const values = files.map(file => {
      const pathImage = path.join(imageConfig.IMAGE_PATH_SERVER, file.filename);
      const imageType = file.mimetype;
      const isActive = 1;
      console.log(`Processing file: ${file.filename}, Path: ${pathImage}, Type: ${imageType}`);
      return [meterInfoID, pathImage, imageType, isActive];
    });

    const query = 'INSERT INTO MeterImages (MeterInfoID, ImageUrl, ImageType, IsActive) VALUES ?';
    console.log('Executing query to insert image paths into the database...');
    await sequelize.query(query, {
      replacements: [values]
    });

    console.log('Images uploaded and paths saved to database successfully.');
    res.status(200).json({ status: 'success', message: 'Successfully uploaded.' });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ status: 'error', message: 'Error uploading images.', error: error.message });
  }
};

exports.fetchImagesByMeterInfoID = async (req, res) => {
  try {
    const meterInfoID = req.body.meterInfoID;
    if (!meterInfoID) {
      return res.status(400).json({ status: 'error', message: 'MeterInfoID is required.' });
    }

    const query = 'SELECT MeterImageID, MeterInfoID, ImageUrl, ImageType FROM MeterImages WHERE MeterInfoID = ? AND IsActive = ?';
    const [results] = await sequelize.query(query, {
      replacements: [meterInfoID]
    });

    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No images found for the given MeterInfoID.' });
    }

    const images = await Promise.all(results.map(async row => {
      const imagePath = path.join(imageConfig.IMAGE_PATH_SERVER, path.basename(row.ImageUrl));
      const imageData = fs.readFileSync(imagePath, 'base64');
      return {
        meterImageID: row.MeterImageID,
        meterInfoID: row.MeterInfoID,
        imageData: `data:${row.ImageType};base64,${imageData}`,
        fileName: path.basename(row.ImageUrl)
      };
    }));

    res.status(200).json({
      status: 'success',
      totalImages: results.length,
      images
    });
  } catch (error) {
    console.error('Error fetching images by MeterInfoID:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching images.', error: error.message });
  }
};

exports.softDeleteImage = async (req, res) => {
  try {
    const meterImageID = req.body.meterImageID;
    const meterInfoID = req.body.meterInfoID;

    if (!meterImageID || !meterInfoID) {
      return res.status(400).json({ status: 'error', message: 'MeterImageID and MeterInfoID are required.' });
    }

    const query = 'UPDATE MeterImages SET IsActive = 0 WHERE MeterImageID = ? AND MeterInfoID = ?';
    await sequelize.query(query, {
      replacements: [meterImageID, meterInfoID]
    });

    console.log(`Image with MeterImageID: ${meterImageID} and MeterInfoID: ${meterInfoID} has been soft deleted.`);
    res.status(200).json({ status: 'success', message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error soft deleting image:', error);
    res.status(500).json({ status: 'error', message: 'Error deleting image.', error: error.message });
  }
};
