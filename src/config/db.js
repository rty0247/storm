// src/config/db.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('storm', 'MySqlUser', 'Admin@1234', {
  host: '49.207.11.223',
  dialect: 'mysql'
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