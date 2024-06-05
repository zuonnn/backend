const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// const { checkOverload } = require('./helpers/check.connection');

dotenv.config();
const app = express();

// Initialize middleware
app.use(express.json()); // Parse JSON
app.use(morgan('dev')); // Log requests
app.use(helmet()); // Set security headers
app.use(compression()); // Compress all responses
app.use(cookieParser()); // Parse cookies

// Initialize database
require('./dbs/init.mongodb');
// checkOverload(); // Check overload

// Initialize routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/messages', require('./routes/message.route'));
app.use('/api/users', require('./routes/user.route'));
// Initialize error handling


// Add your error handling middleware here

module.exports = app;
