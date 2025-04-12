const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const ensureAuthenticated = require('../middleware/auth');

// Public routes
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getSingleProduct);

// Protected routes
router.post('/', ensureAuthenticated, productsController.createProduct);
router.put('/:id', ensureAuthenticated, productsController.updateProduct);
router.delete('/:id', ensureAuthenticated, productsController.deleteProduct);

module.exports = router;