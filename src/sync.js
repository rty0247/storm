// src/sync.js

const sequelize = require('./config/db');
require('./models/lnsPostdata03');
require('./models/lwkeys02');
require('./models/associations');

(async () => {
  try {
    await sequelize.sync(); // This will update the database schema without dropping tables
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
})();
