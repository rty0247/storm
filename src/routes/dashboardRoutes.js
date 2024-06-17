const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/userController');
const dashboardController = require('../controllers/DashboardController');


router.post('/createUser', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/getTotalOutflowInDashboard', dashboardController.getTotalOutflow);
router.post('/getAllDashboardValues', dashboardController.getAllDashboardValues);
router.post('/getTotalConsumptionInClientDashboard', dashboardController.getTotalConsumptionInClientDashboard);
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

router.post('/getMeterDetails', (req, res) => {
    const filePath = path.join(__dirname, '../data/getMeterDetails.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getTotalConsumption', (req, res) => {
    const filePath = path.join(__dirname, '../data/getTotalConsumption.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getZoneWiseConsumption', (req, res) => {
    const filePath = path.join(__dirname, '../data/getZonewiseConsumption.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getDmaWiseConsumption', (req, res) => {
    const filePath = path.join(__dirname, '../data/getDmawiseConsumption.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getDayWiseZoneConsumption', (req, res) => {
    const filePath = path.join(__dirname, '../data/getDayWiseZoneConsumption.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getCustomerSegmentation', (req, res) => {
    const filePath = path.join(__dirname, '../data/getCustomerSegmentation.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getZoneSegmentation', (req, res) => {
    const filePath = path.join(__dirname, '../data/getZoneSegmentation.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/getDmasBasedOnZones', (req, res) => {
    const filePath = path.join(__dirname, '../data/getDmasBasedOnZones.json');
    console.log(filePath)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        res.json(JSON.parse(data));
    });
});
module.exports = router;
