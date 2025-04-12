const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const ensureAuthenticated = require('../middleware/auth');

// Public access GET all contacts and GET contact by id
router.get('/', contactsController.getAllContacts);
router.get('/:id', contactsController.getSingleContact);

// Protected routes require authentication to create, update, or delete contacts
router.post('/', ensureAuthenticated, contactsController.createContact);
router.put('/:id', ensureAuthenticated, contactsController.updateContact);
router.delete('/:id', ensureAuthenticated, contactsController.deleteContact);

module.exports = router;
