//Archivo backend/src/controllers/reportController.js
// Este nuevo controlador se encargará de las consultas avanzadas.

// Este controlador maneja la lógica para las consultas avanzadas y reportes
const reportModel = require('../models/reportModel');

// Consulta 1: Total pagado por cada cliente
exports.getTotalPaymentsByCustomer = async (req, res) => {
    try {
        const [rows] = await reportModel.getTotalPaymentsByCustomer();
        res.json(rows);
    } catch (err) {
        console.error('Error running report "total payments by customer":', err);
        res.status(500).json({ message: 'Error ejecutando la consulta' });
    }
};

// Consulta 2: Facturas pendientes
exports.getPendingInvoices = async (req, res) => {
    try {
        const [rows] = await reportModel.getPendingInvoices();
        res.json(rows);
    } catch (err) {
        console.error('Error running report "pending invoices":', err);
        res.status(500).json({ message: 'Error ejecutando la consulta' });
    }
};

// Consulta 3: Transacciones por plataforma
exports.getTransactionsByPlatform = async (req, res) => {
    const { platformName } = req.params;
    try {
        const [rows] = await reportModel.getTransactionsByPlatform(platformName);
        res.json(rows);
    } catch (err) {
        console.error(`Error running report "transactions by platform ${platformName}":`, err);
        res.status(500).json({ message: 'Error ejecutando la consulta' });
    }
};