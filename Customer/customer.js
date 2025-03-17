// Updated main file (index.js)
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/sequelize');
const morgan = require('morgan');
const loggerUtils = require('./src/utils/logger'); // Import the Winston logger
const routes = require('./src/routes'); // Import all routes from src/routes/index.js
const bodyParser = require('body-parser');
const { redisConnection } = require("./src/cache/redis.js");
const { logger } = require("./src/service/logger.js");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT_CUSTOMER || 301;
const path = require('path');
// Middleware for parsing JSON requests
// app.use(express.json());
app.use(bodyParser.json());
app.use(logger);

redisConnection();


// Use Morgan middleware for logging HTTP requests
// app.use(morgan('tiny', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Middleware for logging all requests
app.use((req, res, next) => {
    loggerUtils.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});


// Parse application/json
// app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/api/v1/health', (req, res) => {
    res.status(200).send({ success: true, message: 'customer API is working!' });
});

// Load all routes
app.use('/api/v1', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    loggerUtils.error(`Error: ${err.message}`);
    res.status(500).send({ success: false, message: 'Something went wrong!' });
});

// upload
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/Jsonfiles", express.static(path.join(__dirname, 'Jsonfiles')));

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
