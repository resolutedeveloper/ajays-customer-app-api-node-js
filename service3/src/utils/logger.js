const winston = require('winston');
require('winston-daily-rotate-file');

// Create a Daily Rotate Transport for log files
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log', // Log file pattern
    datePattern: 'YYYY-MM-DD', // Format for date
    maxFiles: '14d', // Keep logs for 14 days
    level: 'info', // Log level
});

// Create the logger instance with multiple transports
const logger = winston.createLogger({
    level: 'info', // Default log level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to logs
        winston.format.json() // Format logs as JSON
    ),
    transports: [
        new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()) }), // Colorize console output
        transport, // Daily rotate log file
    ]
});

// Export the logger
module.exports = logger;
