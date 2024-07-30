const sequelize = require('../config/db');
const imagePath = require('../config/imageConfig')
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath.IMAGE_PATH_SERVER);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

exports.uploadImages = async (req, res) => {
  try {
    console.log('Starting image upload process...');
    const meterInfoID = req.body.MeterInfoID || null;
    const files = req.files;

    if (!files || files.length === 0) {
      console.log('No files were uploaded.');
      return res.status(400).send('No files were uploaded.');
    }

    const values = files.map(file => {
      const imagePath = path.join(imagePath.IMAGE_PATH_SERVER, file.filename);
      const imageType = file.mimetype;
      const isActive = 1;
      console.log(`Processing file: ${file.filename}, Path: ${imagePath}, Type: ${imageType}`);
      return [meterInfoID, imagePath, imageType,isActive];
    });

    const query = 'INSERT INTO MeterImages (MeterInfoID, ImageUrl, ImageType,IsActive) VALUES ?';
    console.log('Executing query to insert image paths into the database...');
    await sequelize.query(query, {
      replacements: [values]
    });

    console.log('Images uploaded and paths saved to database successfully.');
    res.send('Images uploaded and paths saved to database');
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('Error uploading images');
  }
};

exports.fetchImagesByMeterInfoID = async (req, res) => {
    try {
      const meterInfoID = req.body.meterInfoID;
      if (!meterInfoID) {
        return res.status(400).send('MeterInfoID is required');
      }
  
      const query = 'SELECT MeterImageID, MeterInfoID, ImageUrl FROM MeterImages WHERE MeterInfoID = ? AND IsActive = 1';
      const [results] = await sequelize.query(query, {
        replacements: [meterInfoID]
      });
  
      if (results.length === 0) {
        return res.status(404).send('No images found for the given MeterInfoID');
      }
  
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
      const images = results.map(row => ({
        MeterImageID: row.MeterImageID,
        MeterInfoID: row.MeterInfoID,
        ImageUrl: `${baseUrl}/${path.basename(row.ImageUrl)}`
      }));
  
      res.json(images);
    } catch (error) {
      console.error('Error fetching images by MeterInfoID:', error);
      res.status(500).send('Error fetching images');
    }
  };

  exports.softDeleteImage = async (req, res) => {
    try {
      const meterImageID = req.body.meterImageID;
      const meterInfoID = req.body.meterInfoID;
  
      if (!meterImageID || !meterInfoID) {
        return res.status(400).send('MeterImageID and MeterInfoID are required');
      }
  
      const query = 'UPDATE MeterImages SET IsActive = 0 WHERE MeterImageID = ? AND MeterInfoID = ?';
      await sequelize.query(query, {
        replacements: [meterImageID, meterInfoID]
      });
  
      console.log(`Image with MeterImageID: ${meterImageID} and MeterInfoID: ${meterInfoID} has been soft deleted.`);
      res.send('Image soft deleted successfully');
    } catch (error) {
      console.error('Error soft deleting image:', error);
      res.status(500).send('Error soft deleting image');
    }
  };
  

