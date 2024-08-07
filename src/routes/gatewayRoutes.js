const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/GatewayController');

router.post('/getAllGatewaysWithClientId', gatewayController.getAllGatewaysWithClientId);
router.post('/getGatewayDetailsWithClientIdAndGatewayId', gatewayController.getGatewayDetailsWithClientIdAndGatewayId);
router.post('/getGatewayCountsInGatewayDashboard', gatewayController.getGatewayCountsInGatewayDashboard);
router.post('/getAllGatewaysForDropdown', gatewayController.getAllGatewaysForDropdown);

module.exports = router;