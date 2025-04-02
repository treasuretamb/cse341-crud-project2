const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contacts',
    version: '1.0.0'
  },
  host: 'localhost:3000', // Use localhost for testing; update for production.
  basePath: '/',
  schemes: ['http']
};

const outputFile = './swagger.json';
// Use the existing routes file instead of routes/index.js
const endpointsFiles = ['./routes/contacts.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
