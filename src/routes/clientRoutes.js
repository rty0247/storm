const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const clientController = require('../controllers/ClientController');

router.post('/getAllClients', clientController.getClientDetails);
router.post('/getTotalCustomerWiseSegementation', clientController.getTotalCustomerWiseSegementation);
router.post('/getClientAlerts', clientController.getClientAlerts);

module.exports = router;