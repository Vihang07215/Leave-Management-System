const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const routes = require('./routes/index')
const setupSwagger = require('./config/swagger.js');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON:", err.message);
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload, please check your request body.",
      error: err.message,
    });
  }
  next();
});
// Routes
app.use('/api', routes);
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Swagger docs at http://localhost:${PORT}/api-docs`);
});