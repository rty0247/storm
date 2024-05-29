// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/db'); // Make sure to require the sequelize instance
require('./src/models/lnsPostdata03'); // Load the models
require('./src/models/lwkeys02'); // Load the models
require('./src/models/associations'); // Load associations

const routes = require('./src/routes/Routes');
const lnsPostdata03Routes = require('./src/routes/lnsPostdata03Routes');
const lwKeys02Routes = require('./src/routes/lwKeys02Routes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', routes);
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
