require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/sequelize');
const morgan = require('morgan');
const logger = require('./src/utils/logger');  // Import the Winston logger
const route = require('./src/routes');  // Import all routes from router/index.js


const app = express();
const PORT = process.env.PORT || 3000;

// Use Morgan middleware for logging HTTP requests
app.use(morgan('tiny', { stream: { write: (msg) => logger.info(msg.trim()) } }));  // Log HTTP requests to the console and to the file

// Middleware for logging all requests
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);  // Log general requests
    next();
});

// Use routes
app.use("/api/v1", route);

// Start the server and connect to the database (assuming a connectDB function exists)
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);  // Log when server starts
        });
    })
    .catch((err) => {
        logger.error('Error connecting to the database:', err);  // Log errors
        process.exit(1);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);  // Log error messages
    res.status(500).send({ success: false, message: 'Something went wrong!' });
});
