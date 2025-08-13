Reame-madre

Estructura del Proyecto Aquí está la estructura completa del proyecto. A continuación, te proporciono el código para cada archivo.

```

mi_proyecto/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── customerController.js
│   │   │   └── reportController.js
│   │   ├── models/
│   │   │   └── customerModel.js
│   │   │   └── reportModel.js
│   │   ├── routes/
│   │   │   └── customerRoutes.js
│   │   │   └── reportRoutes.js
│   │   └── db/
│   │   │   └── db-config.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.js
│   └── package.json
└── database/
    └── ddl/
        └── database.sql

```        

Este archivo contiene el script SQL para crear la base de datos y todas las tablas necesarias para el ejercicio. He usado nombres en inglés, como lo piden los requisitos. -- DDL para la base de datos de ExpertSoft -- Se asume que el nombre de la base de datos seguirá el formato: pd_primernombre_primerapellido_clan

CREATE DATABASE IF NOT EXISTS pd_primernombre_primerapellido_clan; USE pd_primernombre_primerapellido_clan;

-- Tabla para los clientes (entidad principal del CRUD) CREATE TABLE Customers ( customer_id INT PRIMARY KEY AUTO_INCREMENT, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL UNIQUE, phone VARCHAR(20), registration_date DATE DEFAULT CURRENT_DATE );

-- Tabla para los productos o servicios que ofrece ExpertSoft CREATE TABLE Products ( product_id INT PRIMARY KEY AUTO_INCREMENT, product_name VARCHAR(150) NOT NULL, description TEXT, price DECIMAL(10, 2) NOT NULL, category VARCHAR(100) );

-- Tabla para las facturas, que enlaza a un cliente CREATE TABLE Invoices ( invoice_id INT PRIMARY KEY AUTO_INCREMENT, customer_id INT NOT NULL, issue_date DATE NOT NULL, total_amount DECIMAL(10, 2) NOT NULL, status ENUM('paid', 'pending', 'cancelled') DEFAULT 'pending', FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) );

-- Tabla para el detalle de las facturas (qué productos hay en cada factura) CREATE TABLE InvoiceDetails ( invoice_detail_id INT PRIMARY KEY AUTO_INCREMENT, invoice_id INT NOT NULL, product_id INT NOT NULL, quantity INT NOT NULL, unit_price DECIMAL(10, 2) NOT NULL, FOREIGN KEY (invoice_id) REFERENCES Invoices(invoice_id), FOREIGN KEY (product_id) REFERENCES Products(product_id) );

-- Tabla para registrar las transacciones de pago CREATE TABLE Transactions ( transaction_id INT PRIMARY KEY AUTO_INCREMENT, invoice_id INT NOT NULL, amount DECIMAL(10, 2) NOT NULL, platform VARCHAR(50), payment_date DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (invoice_id) REFERENCES Invoices(invoice_id) );

Carpeta backend/ El backend completo que te presento a continuación cumple con la estructura MVC y tiene la lógica necesaria para el CRUD y las consultas avanzadas. He añadido comentarios para que entiendas cada parte.

Archivo .env

Archivo backend/src/db/db-config.js

Archivo backend/src/models/customerModel.js Este modelo se encarga de las consultas CRUD para la tabla Customers.

// Este modelo maneja todas las consultas a la base de datos para la tabla de Clientes const pool = require('../db/db-config');

exports.findAll = () => { // Obtener todos los clientes return pool.execute('SELECT * FROM Customers'); };

exports.findById = (id) => { // Encontrar un solo cliente por su ID return pool.execute('SELECT * FROM Customers WHERE customer_id = ?', [id]); };

exports.create = (firstName, lastName, email, phone) => { // Insertar un nuevo cliente return pool.execute( 'INSERT INTO Customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)', [firstName, lastName, email, phone] ); };

exports.update = (id, firstName, lastName, email, phone) => { // Actualizar un cliente existente return pool.execute( 'UPDATE Customers SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE customer_id = ?', [firstName, lastName, email, phone, id] ); };

exports.remove = (id) => { // Eliminar un cliente de la base de datos return pool.execute('DELETE FROM Customers WHERE customer_id = ?', [id]); };

Archivo backend/src/models/reportModel.js Este nuevo modelo se encarga de las consultas avanzadas, manteniendo la separación de responsabilidades.

// Este modelo maneja las consultas avanzadas y reportes const pool = require('../db/db-config');

// Consulta 1: Total pagado por cada cliente exports.getTotalPaymentsByCustomer = () => { return pool.execute( SELECT c.customer_id, CONCAT(c.first_name, ' ', c.last_name) AS customer_name, SUM(t.amount) AS total_paid FROM Customers c JOIN Invoices i ON c.customer_id = i.customer_id JOIN Transactions t ON i.invoice_id = t.invoice_id GROUP BY c.customer_id ORDER BY total_paid DESC; ); };

// Consulta 2: Facturas pendientes con información de cliente exports.getPendingInvoices = () => { return pool.execute( SELECT i.invoice_id, c.customer_id, CONCAT(c.first_name, ' ', c.last_name) AS customer_name, c.email, i.total_amount FROM Invoices i JOIN Customers c ON i.customer_id = c.customer_id WHERE i.status = 'pending'; ); };

// Consulta 3: Transacciones por plataforma exports.getTransactionsByPlatform = (platform) => { return pool.execute( SELECT t.transaction_id, t.amount, t.platform, t.payment_date, i.invoice_id, CONCAT(c.first_name, ' ', c.last_name) AS customer_name, c.email FROM Transactions t JOIN Invoices i ON t.invoice_id = i.invoice_id JOIN Customers c ON i.customer_id = c.customer_id WHERE t.platform = ?;, [platform] ); };

Archivo backend/src/controllers/customerController.js Aquí está el controlador para el CRUD de clientes. He agregado una simulación del "guardián" de permisos para el endpoint de eliminación.

// Este controlador contiene la lógica para manejar las peticiones de clientes const customerModel = require('../models/customerModel');

// Obtener todos los clientes exports.getAllCustomers = async (req, res) => { try { const [rows] = await customerModel.findAll(); res.json(rows); } catch (err) { console.error('Error getting customers:', err); res.status(500).json({ message: 'Error obteniendo clientes' }); } };

// Obtener un cliente por ID exports.getCustomerById = async (req, res) => { const { id } = req.params; try { const [rows] = await customerModel.findById(id); if (rows.length === 0) { return res.status(404).json({ message: 'Cliente no encontrado' }); } res.json(rows[0]); } catch (err) { console.error('Error getting customer by ID:', err); res.status(500).json({ message: 'Error obteniendo cliente' }); } };

// Crear un nuevo cliente exports.createCustomer = async (req, res) => { const { first_name, last_name, email, phone } = req.body; if (!first_name || !last_name || !email) { return res.status(400).json({ message: 'Faltan campos requeridos: first_name, last_name, email' }); } try { const [result] = await customerModel.create(first_name, last_name, email, phone); res.status(201).json({ message: 'Cliente creado', id: result.insertId }); } catch (err) { console.error('Error creating customer:', err); res.status(500).json({ message: 'Error creando cliente' }); } };

// Actualizar un cliente exports.updateCustomer = async (req, res) => { const { id } = req.params; const { first_name, last_name, email, phone } = req.body; try { const [result] = await customerModel.update(id, first_name, last_name, email, phone); if (result.affectedRows === 0) { return res.status(404).json({ message: 'Cliente no encontrado para actualizar' }); } res.json({ message: 'Cliente actualizado' }); } catch (err) { console.error('Error updating customer:', err); res.status(500).json({ message: 'Error actualizando cliente' }); } };

// Eliminar un cliente con simulación de "guardián" exports.deleteCustomer = async (req, res) => { const { id } = req.params; // Simulación del "guardián": se requiere un token en los headers para eliminar const permissionToken = req.headers['x-permission-token']; if (permissionToken !== 'expertsoft-admin-token') { return res.status(403).json({ message: 'Acceso denegado. Se requiere un token de administrador válido.' }); }

try {
    const [result] = await customerModel.remove(id);
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado para eliminar' });
    }
    res.json({ message: 'Cliente eliminado' });
} catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Error eliminando cliente' });
}

};

Archivo backend/src/controllers/reportController.js Este nuevo controlador se encargará de las consultas avanzadas.

// Este controlador maneja la lógica para las consultas avanzadas y reportes const reportModel = require('../models/reportModel');

// Consulta 1: Total pagado por cada cliente exports.getTotalPaymentsByCustomer = async (req, res) => { try { const [rows] = await reportModel.getTotalPaymentsByCustomer(); res.json(rows); } catch (err) { console.error('Error running report "total payments by customer":', err); res.status(500).json({ message: 'Error ejecutando la consulta' }); } };

// Consulta 2: Facturas pendientes exports.getPendingInvoices = async (req, res) => { try { const [rows] = await reportModel.getPendingInvoices(); res.json(rows); } catch (err) { console.error('Error running report "pending invoices":', err); res.status(500).json({ message: 'Error ejecutando la consulta' }); } };

// Consulta 3: Transacciones por plataforma exports.getTransactionsByPlatform = async (req, res) => { const { platformName } = req.params; try { const [rows] = await reportModel.getTransactionsByPlatform(platformName); res.json(rows); } catch (err) { console.error(Error running report "transactions by platform ${platformName}":, err); res.status(500).json({ message: 'Error ejecutando la consulta' }); } };

Archivo backend/src/routes/customerRoutes.js // define las rutas de la API para el CRUD de clientes const express = require('express'); const router = express.Router(); const customerController = require('../controllers/customerController');

// GET all customers router.get('/customers', customerController.getAllCustomers);

// GET a single customer router.get('/customers/:id', customerController.getCustomerById);

// POST a new customer router.post('/customers', customerController.createCustomer);

// PUT/PATCH to update a customer router.put('/customers/:id', customerController.updateCustomer);

// DELETE a customer (con guardián de permisos) router.delete('/customers/:id', customerController.deleteCustomer);

module.exports = router;

Archivo backend/src/routes/reportRoutes.js Este nuevo archivo contiene las rutas para las consultas avanzadas.

// define las rutas de la API para las consultas avanzadas const express = require('express'); const router = express.Router(); const reportController = require('../controllers/reportController');

// GET total pagado por cada cliente router.get('/reports/total_payments_by_customer', reportController.getTotalPaymentsByCustomer);

// GET facturas pendientes router.get('/reports/pending_invoices', reportController.getPendingInvoices);

// GET transacciones por plataforma (ej: /reports/transactions_by_platform/Nequi) router.get('/reports/transactions_by_platform/:platformName', reportController.getTransactionsByPlatform);

module.exports = router;

Archivo backend/server.js Este es el punto de entrada de tu servidor, que ahora usa las rutas de clientes y de reportes.

Carpeta frontend/ El frontend es el dashboard. Te he actualizado el código del App.js para que se adapte a los nuevos nombres de las columnas en inglés (first_name, last_name, email, phone) y para que muestre la funcionalidad de las consultas avanzadas.

Comando para .env

Crea el archivo .env: Usa el comando touch para crear un archivo vacío llamado .env.

Bash

touch .env

Edita el archivo .env: Usa el editor de texto nano (que es fácil de usar para principiantes) para abrir y editar el archivo.

Bash

nano .env

Se abrirá un editor de texto en tu terminal. Ahora, copia y pega el siguiente contenido en él, asegurándote de reemplazar los valores de your_password y pd_primernombre_primerapellido_clan con los tuyos:

Bash

DB_HOST=localhost DB_USER=root DB_PASSWORD=your_password DB_NAME=pd_primernombre_primerapellido_clan PORT=3000 Para guardar y salir de nano, presiona Ctrl + X, luego Y para confirmar que quieres guardar los cambios, y finalmente Enter.

¡Y listo! Con eso, tu archivo .env estará creado y configurado en tu proyecto.