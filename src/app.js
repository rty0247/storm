// src/app.js

const express = require('express');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const port = 3000;

app.use('/api', dashboardRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
