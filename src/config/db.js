// src/config/db.js
require('dotenv').config({ path: './src/.env' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;