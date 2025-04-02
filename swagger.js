const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contacts',
    version: '1.0.0'
  },
  host: 'https://cse341-crud-project2-u5wz.onrender.com',
  basePath: '/',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/contacts.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
