const express = require('express');
const mongodb = require('./data/database');
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`)
});

// Middleware to parse JSON and URL encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Mount contacts routes
app.use('/contacts', require('./routes/contacts'));

// Mount products routes
app.use('/products', require('./routes/products'));

// Mount swagger routes 
app.use('/api-docs', require('./routes/swagger'));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
  }
});
