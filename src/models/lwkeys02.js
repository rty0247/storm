// // src/models/lwkeys02.js

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Lwkeys02 = sequelize.define('Lwkeys02', {
//   ID: {
//     type: DataTypes.BIGINT,
//     allowNull: false,
//     primaryKey: true
//   },
//   SERIAL: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     unique: true
//   },
//   MTR_TYPE: DataTypes.STRING(20),
//   MTR_GROUP: DataTypes.INTEGER,
//   MTR_ORDER: DataTypes.INTEGER,
//   MTR_CODE: DataTypes.STRING(20),
//   CLIENT: DataTypes.STRING(30),
//   ZONE: DataTypes.STRING(30),
//   DMA: DataTypes.STRING(30),
//   MTR_NUMBER: DataTypes.STRING(20),
//   RXENABLE: DataTypes.TINYINT,
//   CSVENABLE: DataTypes.TINYINT,
//   WEBENABLE: DataTypes.TINYINT,
//   POSTENABLE: DataTypes.TINYINT,
//   JOINRES: DataTypes.TINYINT,
//   GATEWAY: DataTypes.STRING(20),
//   GATEWAY_ID: DataTypes.BLOB,
//   DEVADD: DataTypes.BLOB,
//   NWKSKEY: DataTypes.BLOB,
//   APPSKEY: DataTypes.BLOB,
//   APPKEY: DataTypes.BLOB,
//   DEVEUI: DataTypes.BLOB,
//   APPEUI: DataTypes.BLOB,
//   STATUS: DataTypes.STRING(20),
//   DIA: DataTypes.MEDIUMINT,
//   DAILYMAX: DataTypes.INTEGER,
//   MONTHMAX: DataTypes.INTEGER,
//   AVGCONSUM: DataTypes.INTEGER,
//   INSTL_DATE: DataTypes.DATE,
//   REMARKS: DataTypes.STRING(50)
// }, {
//   timestamps: false,
//   tableName: 'lwkeys02'
// });

// module.exports = Lwkeys02;
