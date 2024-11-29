// // src/index.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const sequelize = require('./src/config/db'); // Make sure to require the sequelize instance
// const cors = require('cors');
// require('./src/models/lnsPostdata03'); // Load the models
// require('./src/models/lwkeys02'); // Load the models
// require('./src/models/associations'); // Load associations

// const routes = require('./src/routes/Routes');
// const lnsPostdata03Routes = require('./src/routes/lnsPostdata03Routes');
// const lwKeys02Routes = require('./src/routes/lwKeys02Routes');
// const dashboardRoutes = require('./src/routes/dashboardRoutes');
// const clientRoutes = require('./src/routes/clientRoutes');
// const zoneRoutes = require('./src/routes/zoneRoutes');
// const dmaRoutes = require('./src/routes/dmaRoutes');
// const meterRoutes = require('./src/routes/meterRoutes');
// const gatewayRoutes = require('./src/routes/gatewayRoutes');
// const imageRoutes = require('./src/routes/imageUploadRoutes')


// const app = express();
// const port = 3307;
// app.use('/uploads', express.static('C:\\Users\\ADMIN\\Desktop\\MeterImages'));
// app.use(cors()); 
// app.use(bodyParser.json());
// app.use('/dashboard', dashboardRoutes);
// app.use('/api', dashboardRoutes);
// app.use('/clients', clientRoutes);
// app.use('/zones', zoneRoutes);
// app.use('/dma', dmaRoutes);
// app.use('/meters', meterRoutes);
// app.use('/gateways', gatewayRoutes);
// app.use('/postData', lnsPostdata03Routes);
// app.use('/keys', lwKeys02Routes);
// app.use('/images',imageRoutes);

// (async () => {
//   try {
//     await sequelize.authenticate(); // Ensure database connection is established
//     console.log('Database connection established successfully.');

//     await sequelize.sync(); // Sync models
//     console.log('Database synchronized successfully.');

//     app.listen(port, () => {
//       console.log(`Server running on http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

// src/index.js

// Import necessary modules and libraries
const express = require('express'); // Import the express framework for creating the server
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const sequelize = require('./src/config/db'); // Import the sequelize instance for database connection
const cors = require('cors'); // Middleware to handle Cross-Origin Resource Sharing (CORS)
require('./src/models/lnsPostdata03'); // Load the 'lnsPostdata03' model
require('./src/models/lwkeys02'); // Load the 'lwkeys02' model
require('./src/models/associations'); // Load associations between models

// Import route modules for handling different parts of the API
const routes = require('./src/routes/Routes'); // General routes for the application
const lnsPostdata03Routes = require('./src/routes/lnsPostdata03Routes'); // Routes for the 'lnsPostdata03' model
const lwKeys02Routes = require('./src/routes/lwKeys02Routes'); // Routes for the 'lwkeys02' model
const dashboardRoutes = require('./src/routes/dashboardRoutes'); // Routes for the dashboard
const clientRoutes = require('./src/routes/clientRoutes'); // Routes for client-related API
const zoneRoutes = require('./src/routes/zoneRoutes'); // Routes for zone-related API
const dmaRoutes = require('./src/routes/dmaRoutes'); // Routes for DMA (Direct Memory Access)
const meterRoutes = require('./src/routes/meterRoutes'); // Routes for meter-related API
const gatewayRoutes = require('./src/routes/gatewayRoutes'); // Routes for gateway-related API
const imageRoutes = require('./src/routes/imageUploadRoutes'); // Routes for image uploads

// Create an Express application instance
const app = express();
const port = 3307; // Define the port for the server to listen on

// Serve static files (images) from the specified directory
app.use('/uploads', express.static('C:\\Users\\ADMIN\\Desktop\\MeterImages')); // Serving images for meter-related tasks

// Enable CORS (Cross-Origin Resource Sharing) to allow API access from different origins
app.use(cors()); 

// Use body-parser middleware to parse incoming JSON request bodies
app.use(bodyParser.json());

// Define routes for various API endpoints
app.use('/dashboard', dashboardRoutes); // Routes for dashboard
app.use('/api', dashboardRoutes); // Alias for dashboard routes
app.use('/clients', clientRoutes); // Routes for client-related functionality
app.use('/zones', zoneRoutes); // Routes for zone-related functionality
app.use('/dma', dmaRoutes); // Routes for DMA functionality
app.use('/meters', meterRoutes); // Routes for meter-related functionality
app.use('/gateways', gatewayRoutes); // Routes for gateway-related functionality
app.use('/postData', lnsPostdata03Routes); // Routes for postData (lnsPostdata03)
app.use('/keys', lwKeys02Routes); // Routes for keys (lwkeys02)
app.use('/images', imageRoutes); // Routes for image uploads

// Immediately-invoked async function to handle database connection and start the server
(async () => {
  try {
    // Authenticate the database connection
    await sequelize.authenticate(); // Ensure database connection is established
    console.log('Database connection established successfully.');

    // Sync the database models with the database
    await sequelize.sync(); // Sync models
    console.log('Database synchronized successfully.');

    // Start the Express server and listen on the specified port
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    // Log any errors encountered while connecting to the database
    console.error('Unable to connect to the database:', error);
  }
})();
