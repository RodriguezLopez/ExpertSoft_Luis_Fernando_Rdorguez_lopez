// define las rutas de la API para las consultas avanzadas
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET total pagado por cada cliente
router.get('/reports/total_payments_by_customer', reportController.getTotalPaymentsByCustomer);

// GET facturas pendientes
router.get('/reports/pending_invoices', reportController.getPendingInvoices);

// GET transacciones por plataforma (ej: /reports/transactions_by_platform/Nequi)
router.get('/reports/transactions_by_platform/:platformName', reportController.getTransactionsByPlatform);

module.exports = router;