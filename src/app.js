const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const errorHandler = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

const corsOptions = {
    origin: '*',  
    methods: 'GET,POST,PUT,DELETE',  
    allowedHeaders: 'Content-Type,Authorization',  
  };

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = app;