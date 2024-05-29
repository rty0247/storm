// src/routes/lnsPostdata03Routes.js

const express = require('express');
const router = express.Router();
const Lwkeys02Controller = require('../controllers/lwKeys02Controller');

router.get('/getAllLwKeys', Lwkeys02Controller.getAllLwKeys);
//router.post('/', lnsPostdata03Controller.createLnsPostdata03);

module.exports = router;
