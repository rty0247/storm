// // src/config/db.js
// require('dotenv').config({ path: './src/.env' });
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: process.env.DB_DIALECT
// });

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

// module.exports = sequelize;
// src/config/db.js

// Load environment variables from the .env file located in the './src' directory.
require('dotenv').config({ path: './src/.env' });

// Import the Sequelize library for database management.
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance with database connection parameters sourced from environment variables.
const sequelize = new Sequelize(
  process.env.DB_SCHEMA,    // Database name
  process.env.DB_USERNAME,  // Database username
  process.env.DB_PASSWORD,  // Database password
  {
    host: process.env.DB_HOST,       // Database host (e.g., localhost, remote server)
    dialect: process.env.DB_DIALECT // Database dialect (e.g., mysql, postgres, sqlite)
  }
);

// Immediately Invoked Function Expression (IIFE) to test the database connection.
(async () => {
  try {
    // Attempt to authenticate with the database using Sequelize.
    await sequelize.authenticate();
    console.log('Connection has been established successfully.'); // Log success message.
  } catch (error) {
    // Log an error message if the connection fails.
    console.error('Unable to connect to the database:', error);
  }
})();

// Export the Sequelize instance for use in other parts of the application.
module.exports = sequelize;
