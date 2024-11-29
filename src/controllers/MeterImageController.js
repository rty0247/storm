// const sequelize = require('../config/db');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const imageConfig = require('../config/imageConfig');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, imageConfig.IMAGE_PATH_SERVER);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// exports.uploadImages = async (req, res) => {
//   try {
//     console.log('Starting image upload process...');
//     const meterInfoID = req.body.meterInfoID || null;
//     const files = req.files;

//     if (!files || files.length === 0) {
//       console.log('No files were uploaded.');
//       return res.status(400).json({ status: 'error', message: 'No files were uploaded.' });
//     }

//     const values = files.map(file => {
//       const pathImage = path.join(imageConfig.IMAGE_PATH_SERVER, file.filename);
//       const imageType = file.mimetype;
//       const isActive = 1;
//       console.log(`Processing file: ${file.filename}, Path: ${pathImage}, Type: ${imageType}`);
//       return [meterInfoID, pathImage, imageType, isActive];
//     });

//     const query = 'INSERT INTO MeterImages (MeterInfoID, ImageUrl, ImageType, IsActive) VALUES ?';
//     console.log('Executing query to insert image paths into the database...');
//     await sequelize.query(query, {
//       replacements: [values]
//     });

//     console.log('Images uploaded and paths saved to database successfully.');
//     res.status(200).json({ status: 'success', message: 'Successfully uploaded.' });
//   } catch (error) {
//     console.error('Error uploading images:', error);
//     res.status(500).json({ status: 'error', message: 'Error uploading images.', error: error.message });
//   }
// };

// exports.fetchImagesByMeterInfoID = async (req, res) => {
//   try {
//     const meterInfoID = req.body.meterInfoID;
//     if (!meterInfoID) {
//       return res.status(400).json({ status: 'error', message: 'MeterInfoID is required.' });
//     }

//     const query = 'SELECT MeterImageID, MeterInfoID, ImageUrl, ImageType FROM MeterImages WHERE MeterInfoID = ? AND IsActive = 1';
//     const [results] = await sequelize.query(query, {
//       replacements: [meterInfoID]
//     });

//     if (results.length === 0) {
//       return res.status(404).json({ status: 'error', message: 'No images found for the given MeterInfoID.' });
//     }

//     const images = await Promise.all(results.map(async row => {
//       const imagePath = path.join(imageConfig.IMAGE_PATH_SERVER, path.basename(row.ImageUrl));
//       const imageData = fs.readFileSync(imagePath, 'base64');
//       return {
//         meterImageID: row.MeterImageID,
//         meterInfoID: row.MeterInfoID,
//         imageData: `data:${row.ImageType};base64,${imageData}`,
//         fileName: path.basename(row.ImageUrl)
//       };
//     }));

//     res.status(200).json({
//       status: 'success',
//       totalImages: results.length,
//       images
//     });
//   } catch (error) {
//     console.error('Error fetching images by MeterInfoID:', error);
//     res.status(500).json({ status: 'error', message: 'Error fetching images.', error: error.message });
//   }
// };

// exports.softDeleteImage = async (req, res) => {
//   try {
//     const meterImageID = req.body.meterImageID;
//     const meterInfoID = req.body.meterInfoID;

//     if (!meterImageID || !meterInfoID) {
//       return res.status(400).json({ status: 'error', message: 'MeterImageID and MeterInfoID are required.' });
//     }

//     const query = 'UPDATE MeterImages SET IsActive = 0 WHERE MeterImageID = ? AND MeterInfoID = ?';
//     await sequelize.query(query, {
//       replacements: [meterImageID, meterInfoID]
//     });

//     console.log(`Image with MeterImageID: ${meterImageID} and MeterInfoID: ${meterInfoID} has been soft deleted.`);
//     res.status(200).json({ status: 'success', message: 'Image deleted successfully.' });
//   } catch (error) {
//     console.error('Error soft deleting image:', error);
//     res.status(500).json({ status: 'error', message: 'Error deleting image.', error: error.message });
//   }
// };


// Import necessary modules
const sequelize = require('../config/db');  // Database connection
const multer = require('multer');  // Middleware for handling file uploads
const path = require('path');  // Path utilities
const fs = require('fs');  // File system utilities
const imageConfig = require('../config/imageConfig');  // Configuration for image paths

// Multer storage configuration for handling uploaded files
const storage = multer.diskStorage({
  // Define destination directory for uploaded files
  destination: (req, file, cb) => {
    cb(null, imageConfig.IMAGE_PATH_SERVER);  // Path where images will be stored
  },
  // Define the filename for the uploaded file
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Use the original name of the file
  }
});

// Multer instance to handle file uploads
const upload = multer({ storage: storage });

// Endpoint to upload images
exports.uploadImages = async (req, res) => {
  try {
    console.log('Starting image upload process...');
    
    // Retrieve the meterInfoID from the request body (if available)
    const meterInfoID = req.body.meterInfoID || null;
    const files = req.files;  // Get the uploaded files from the request

    // Check if files are present in the request
    if (!files || files.length === 0) {
      console.log('No files were uploaded.');
      return res.status(400).json({ status: 'error', message: 'No files were uploaded.' });
    }

    // Map through the uploaded files to construct the data to insert into the database
    const values = files.map(file => {
      const pathImage = path.join(imageConfig.IMAGE_PATH_SERVER, file.filename);  // Full path to the image
      const imageType = file.mimetype;  // Image type (MIME type)
      const isActive = 1;  // Set to 1 to indicate the image is active
      console.log(`Processing file: ${file.filename}, Path: ${pathImage}, Type: ${imageType}`);
      
      return [meterInfoID, pathImage, imageType, isActive];  // Return array with values for DB insertion
    });

    // SQL query to insert the image paths into the database
    const query = 'INSERT INTO MeterImages (MeterInfoID, ImageUrl, ImageType, IsActive) VALUES ?';
    console.log('Executing query to insert image paths into the database...');
    
    // Execute the query to insert the values into the MeterImages table
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

// Endpoint to fetch images associated with a specific MeterInfoID
exports.fetchImagesByMeterInfoID = async (req, res) => {
  try {
    const meterInfoID = req.body.meterInfoID;  // Retrieve the MeterInfoID from the request body
    
    // Check if MeterInfoID is provided
    if (!meterInfoID) {
      return res.status(400).json({ status: 'error', message: 'MeterInfoID is required.' });
    }

    // SQL query to fetch the images associated with the given MeterInfoID
    const query = 'SELECT MeterImageID, MeterInfoID, ImageUrl, ImageType FROM MeterImages WHERE MeterInfoID = ? AND IsActive = 1';
    const [results] = await sequelize.query(query, {
      replacements: [meterInfoID]
    });

    // If no images are found for the given MeterInfoID
    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No images found for the given MeterInfoID.' });
    }

    // Map through the results and prepare image data in base64 format
    const images = await Promise.all(results.map(async row => {
      const imagePath = path.join(imageConfig.IMAGE_PATH_SERVER, path.basename(row.ImageUrl));  // Get the full path
      const imageData = fs.readFileSync(imagePath, 'base64');  // Read image file and convert to base64
      return {
        meterImageID: row.MeterImageID,
        meterInfoID: row.MeterInfoID,
        imageData: `data:${row.ImageType};base64,${imageData}`,  // Create base64 data URL
        fileName: path.basename(row.ImageUrl)  // Get the file name of the image
      };
    }));

    // Return the images as a response
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

// Endpoint to soft delete an image (mark as inactive)
exports.softDeleteImage = async (req, res) => {
  try {
    const meterImageID = req.body.meterImageID;  // Retrieve the MeterImageID from the request body
    const meterInfoID = req.body.meterInfoID;  // Retrieve the MeterInfoID from the request body

    // Check if MeterImageID and MeterInfoID are provided
    if (!meterImageID || !meterInfoID) {
      return res.status(400).json({ status: 'error', message: 'MeterImageID and MeterInfoID are required.' });
    }

    // SQL query to update the image status to inactive (soft delete)
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
