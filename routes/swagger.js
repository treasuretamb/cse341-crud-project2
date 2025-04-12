const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Update host/scheme dynamically for production
if (process.env.NODE_ENV === 'production') {
  swaggerDocument.host = 'cse341-crud-project2-u5wz.onrender.com';
  swaggerDocument.schemes = ['https'];
}

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    oauth: {
      clientId: process.env.GITHUB_CLIENT_ID,
      scopes: ['user:email'],
      usePkceWithAuthorizationCodeGrant: true,
      redirectUri: 'https://cse341-crud-project2-u5wz.onrender.com/auth/github/callback'
    },
    defaultModelRendering: 'model',
    displayRequestDuration: true,
    docExpansion: 'none'
  }
}));

module.exports = router;
