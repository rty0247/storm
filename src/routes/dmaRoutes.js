const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dmaController = require('../controllers/DMAController');

router.post('/getAllDMAsWithClientIdAndZoneId', dmaController.getAllDMAsWithClientIdAndZoneId);

module.exports = router;