// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/db'); // Make sure to require the sequelize instance
const cors = require('cors');
require('./src/models/lnsPostdata03'); // Load the models
require('./src/models/lwkeys02'); // Load the models
require('./src/models/associations'); // Load associations

const routes = require('./src/routes/Routes');
const lnsPostdata03Routes = require('./src/routes/lnsPostdata03Routes');
const lwKeys02Routes = require('./src/routes/lwKeys02Routes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const zoneRoutes = require('./src/routes/zoneRoutes');
const dmaRoutes = require('./src/routes/dmaRoutes');
const meterRoutes = require('./src/routes/meterRoutes');


const app = express();
const port = 3307;

app.use(cors()); 
app.use(bodyParser.json());
app.use('/dashboard', dashboardRoutes);
app.use('/api', dashboardRoutes);
app.use('/clients', clientRoutes);
app.use('/zones', zoneRoutes);
app.use('/dma', dmaRoutes);
app.use('/meters', meterRoutes);
app.use('/postData', lnsPostdata03Routes);
app.use('/keys', lwKeys02Routes);

(async () => {
  try {
    await sequelize.authenticate(); // Ensure database connection is established
    console.log('Database connection established successfully.');

    await sequelize.sync(); // Sync models
    console.log('Database synchronized successfully.');

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
