const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

// GET all products
router.get('/', productsController.getAllProducts);

// GET a single product by id
router.get('/:id', productsController.getSingleProduct);

// POST: Create a new product
router.post('/', productsController.createProduct);

// PUT: Update a product by id
router.put('/:id', productsController.updateProduct);

// DELETE: Delete a product by id
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
