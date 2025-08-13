// Este controlador contiene la lógica para manejar las peticiones de clientes
const customerModel = require('../models/customerModel');

// Obtener todos los clientes
exports.getAllCustomers = async (req, res) => {
    try {
        const [rows] = await customerModel.findAll();
        res.json(rows);
    } catch (err) {
        console.error('Error getting customers:', err);
        res.status(500).json({ message: 'Error obteniendo clientes' });
    }
};

// Obtener un cliente por ID
exports.getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await customerModel.findById(id);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error getting customer by ID:', err);
        res.status(500).json({ message: 'Error obteniendo cliente' });
    }
};

// Crear un nuevo cliente
exports.createCustomer = async (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ message: 'Faltan campos requeridos: first_name, last_name, email' });
    }
    try {
        const [result] = await customerModel.create(first_name, last_name, email, phone);
        res.status(201).json({ message: 'Cliente creado', id: result.insertId });
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ message: 'Error creando cliente' });
    }
};

// Actualizar un cliente
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;
    try {
        const [result] = await customerModel.update(id, first_name, last_name, email, phone);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado para actualizar' });
        }
        res.json({ message: 'Cliente actualizado' });
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ message: 'Error actualizando cliente' });
    }
};

// Eliminar un cliente con simulación de "guardián"
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    // Simulación del "guardián": se requiere un token en los headers para eliminar
    const permissionToken = req.headers['x-permission-token'];
    if (permissionToken !== 'expertsoft-admin-token') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere un token de administrador válido.' });
    }

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
}