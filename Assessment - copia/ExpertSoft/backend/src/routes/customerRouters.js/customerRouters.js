// define las rutas de la API para el CRUD de clientes
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET all customers
router.get('/customers', customerController.getAllCustomers);

// GET a single customer
router.get('/customers/:id', customerController.getCustomerById);

// POST a new customer
router.post('/customers', customerController.createCustomer);

// PUT/PATCH to update a customer
router.put('/customers/:id', customerController.updateCustomer);

// DELETE a customer (con guardián de permisos)
router.delete('/customers/:id', customerController.deleteCustomer);

module.exports = router;