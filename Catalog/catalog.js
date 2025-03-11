// Updated main file (index.js)
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/sequelize');
// const morgan = require('morgan');
const loggerUtils = require('./src/utils/logger'); // Import the Winston logger
const routes = require('./src/routes'); // Import all routes from src/routes/index.js
const axios = require('axios');
const { redisConnection } = require("./src/cache/redis");
const app = express();
const PORT = process.env.PORT_CATALOG || 302;
const path = require('path');
require('./src/jobs/processImage');
const { logger } = require("./src/services/logger");

// Middleware for parsing JSON requests
app.use(express.json());
app.use(logger);
app.use('/itemImage', express.static(path.join(__dirname, 'src', 'public', 'items')));
app.use('/categoryImage', express.static(path.join(__dirname, 'src', 'public', 'catlog')));

// Use Morgan middleware for logging HTTP requests
// app.use(morgan('tiny', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Middleware for logging all requests
app.use((req, res, next) => {
    loggerUtils.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});
//New route to handle `/`
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the Catalog API!' });
});

// Health check route
app.get('/api/v1/health', (req, res) => {
    res.status(200).send({ success: true, message: 'catalog API is working!' });
});

app.get('/api/v1/health2', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:301/api/v1/health'); // Local URL
        res.json({
            message: "Successfully fetched data from Service Two!",
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch data from Service Two",
            error: error.message
        });
    }
});

// Load all routes
app.use('/api/v1', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    loggerUtils.error(`Error: ${err.message}`);
    res.status(500).send({ success: false, message: 'Something went wrong!' });
});

redisConnection();

// Start the server and connect to the database
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            loggerUtils.info(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        loggerUtils.error('Error connecting to the database:', err);
        process.exit(1);
    });
//Export app for testing (optional)
module.exports = app;
