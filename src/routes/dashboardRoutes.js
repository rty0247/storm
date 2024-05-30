// src/routes/dashboardRoutes.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/getTotalDashboards', (req, res) => {
    const{clientId,zoneId,fromDate,toDate} = req.body;
    console.log(clientId,"ClientID")
    const filePath = path.join(__dirname, '../data/getDashboardScores.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getGatewayDetails', (req, res) => {
    const filePath = path.join(__dirname, '../data/getAllGatewayDetails.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getGatewayDetailsById', (req, res) => {
    const filePath = path.join(__dirname, '../data/getGatewayDetailsById.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getAlerts', (req, res) => {
    const filePath = path.join(__dirname, '../data/getAlerts.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getTotalOutFlow', (req, res) => {
    const filePath = path.join(__dirname, '../data/getTotalOutFlow.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getDmaOutFlow', (req, res) => {
    const filePath = path.join(__dirname, '../data/getDmaOutFlow.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getOutFlowTrend', (req, res) => {
    const filePath = path.join(__dirname, '../data/getOutFlowTrend.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getAllClients', (req, res) => {
    const filePath = path.join(__dirname, '../data/getAllClients.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});
module.exports = router;
