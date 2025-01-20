// Updated main file (index.js)
require('dotenv').config();
const express = require('express');
const http = require('http');
const { connectDB } = require('./src/config/sequelize');
const morgan = require('morgan');
const logger = require('./src/utils/logger'); // Import the Winston logger
const routes = require('./src/routes'); // Import all routes from src/routes/index.js
const { redisConnection } = require("./src/cache/redis.js");

redisConnection();

const setupSocket = require('./src/config/socket');  // socket.js ko import karein

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
const PORT = process.env.PORT_ORDER || 300;

// Middleware for parsing JSON requests
app.use(express.json());

// Use Morgan middleware for logging HTTP requests
app.use(morgan('tiny', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Middleware for logging all requests
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    req.io = io;
    next();
});

// Health check route
app.get('/api/v1/health', (req, res) => {
    res.status(200).send({ success: true, message: 'order API is working!' });
});

// Load all routes
app.use('/api/v1', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send({ success: false, message: 'Something went wrong!' });
});

// Start the server and connect to the database

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        logger.error('Error connecting to the database:', err);
        process.exit(1);
    });
