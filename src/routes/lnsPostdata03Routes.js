// src/routes/lnsPostdata03Routes.js

const express = require('express');
const router = express.Router();
const lnsPostdata03Controller = require('../controllers/lnsPostdata03Controller');

router.get('/getAllLnsPostData', lnsPostdata03Controller.getAllLnsPostdata03);
//router.post('/', lnsPostdata03Controller.createLnsPostdata03);

module.exports = router;
