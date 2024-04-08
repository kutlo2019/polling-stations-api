const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./routes.js');

const loadToSQL = require('./loadData.js');
loadToSQL.loadToSQL();

const app = express();
app.use(bodyParser.json());
app.use('/api', routes);

// Define rate limiting options
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all requests
app.use(limiter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http:127.0.0.1:${PORT}`);
});