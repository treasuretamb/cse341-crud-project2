const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Treasures Contacts and Products API',
    description: 'API for managing contacts and products with OAuth authentication',
    version: '1.0.0'
  },
  host: process.env.NODE_ENV === 'production' ? 'cse341-crud-project2-u5wz.onrender.com' : 'localhost:3000',
  schemes: [process.env.NODE_ENV === 'production' ? 'https' : 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/contacts.js', './routes/products.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);