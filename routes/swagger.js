// routes/swagger.js
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Remove the prefix here—serve and set up on the root of this router.
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
