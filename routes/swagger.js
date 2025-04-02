const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Dynamically set host and schemes based on environment
if (process.env.NODE_ENV === 'production') {
  swaggerDocument.host = 'cse341-crud-project2-u5wz.onrender.com';
  swaggerDocument.schemes = ['https'];
} else {
  swaggerDocument.host = 'localhost:3000';
  swaggerDocument.schemes = ['http'];
}

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;