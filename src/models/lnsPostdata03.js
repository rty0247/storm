// src/models/lnsPostdata03.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LnsPostdata03 = sequelize.define('LnsPostdata03', {
  ID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  SERIAL: DataTypes.INTEGER,
  DEVEUI: DataTypes.BLOB,
  APPID: DataTypes.INTEGER,
  TYPE: DataTypes.STRING(20),
  TIME: DataTypes.BIGINT,
  MTR_TYPE: DataTypes.STRING(20),
  MTR_CODE: DataTypes.STRING(20),
  CLIENT: DataTypes.STRING(30),
  ZONE: DataTypes.STRING(30),
  DMA: DataTypes.STRING(30),
  MTR_NUMBER: DataTypes.STRING(20),
  TIMESTAMP: DataTypes.DATE,
  DATAH: DataTypes.BLOB,
  COUNT: DataTypes.BLOB,
  UNIT: DataTypes.BLOB,
  READH: DataTypes.BLOB,
  READING: DataTypes.DECIMAL(12, 4),
  STATUS: DataTypes.BLOB,
  BATTERY: DataTypes.BLOB,
  DEVADD: DataTypes.BLOB,
  GWID: DataTypes.BLOB,
  RSSI: DataTypes.INTEGER,
  SNR: DataTypes.DECIMAL(6, 2),
  FREQ: DataTypes.DECIMAL(10, 6),
  DR: DataTypes.INTEGER,
  ADR: DataTypes.TINYINT,
  CLASS: DataTypes.CHAR(10),
  FCNT: DataTypes.BLOB,
  FPORT: DataTypes.BLOB,
  CONFIRMED: DataTypes.TINYINT,
  PAYLOAD: DataTypes.STRING(80),
  GWS_ID: DataTypes.BLOB,
  GWS_RSSI: DataTypes.INTEGER,
  GWS_SNR: DataTypes.DECIMAL(6, 2),
  GWS_COUNT: DataTypes.INTEGER,
  REMARKS: DataTypes.STRING(30)
}, {
  timestamps: false,
  tableName: 'lns_postdata03'
});

module.exports = LnsPostdata03;
