const pool = require('../db/db-config');

// Consulta 1: Total pagado por cada cliente
exports.getTotalPaymentsByCustomer = () => {
    return pool.execute(
        `SELECT
            c.customer_id,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            SUM(t.amount) AS total_paid
        FROM Customers c
        JOIN Invoices i ON c.customer_id = i.customer_id
        JOIN Transactions t ON i.invoice_id = t.invoice_id
        GROUP BY c.customer_id
        ORDER BY total_paid DESC;`
    );
};

// Consulta 2: Facturas pendientes con información de cliente
exports.getPendingInvoices = () => {
    return pool.execute(
        `SELECT
            i.invoice_id,
            c.customer_id,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            c.email,
            i.total_amount
        FROM Invoices i
        JOIN Customers c ON i.customer_id = c.customer_id
        WHERE i.status = 'pending';`
    );
};

// Consulta 3: Transacciones por plataforma
exports.getTransactionsByPlatform = (platform) => {
    return pool.execute(
        `SELECT
            t.transaction_id,
            t.amount,
            t.platform,
            t.payment_date,
            i.invoice_id,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            c.email
        FROM Transactions t
        JOIN Invoices i ON t.invoice_id = i.invoice_id
        JOIN Customers c ON i.customer_id = c.customer_id
        WHERE t.platform = ?;`,
        [platform]
    );
};