const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const zoneController = require('../controllers/ZoneController');

router.post('/getAllZoneDetailsWithClientId', zoneController.getAllZoneDetailsWithClientId);
router.post('/getZoneWiseConsumptionInClientDashboardsss', zoneController.getZoneWiseConsumptionInClientDashboard);

module.exports = router;