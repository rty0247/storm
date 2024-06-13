const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const clientController = require('../controllers/ClientController');

router.post('/getAllClients', clientController.getClientDetails);

module.exports = router;