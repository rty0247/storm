const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const meterController = require('../controllers/MeterController');

router.post('/getAllMetersWithClientIdZoneIdAndDmaId', meterController.getAllMetersWithClientIdZoneIdAndDmaId);

module.exports = router;