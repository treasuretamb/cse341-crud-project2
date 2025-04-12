const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products'); // Correct controller reference
const ensureAuthenticated = require('../middleware/auth');

// Public access GET all products and GET product by id
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getSingleProduct);

// Protected routes require authentication to create, update, or delete products
router.post('/', ensureAuthenticated, productsController.createProduct);
router.put('/:id', ensureAuthenticated, productsController.updateProduct);
router.delete('/:id', ensureAuthenticated, productsController.deleteProduct);

module.exports = router;
