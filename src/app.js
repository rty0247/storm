// src/app.js

const express = require('express');
const dashboardRoutes = require('./routes/dashboardRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const port = 3000;

app.use('/api', dashboardRoutes);
app.use('/clients', clientRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
