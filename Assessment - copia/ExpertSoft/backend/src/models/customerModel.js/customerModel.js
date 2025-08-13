exports.findAll = () => {
    // Obtener todos los clientes
    return pool.execute('SELECT * FROM Customers');
};

exports.findById = (id) => {
    // Encontrar un solo cliente por su ID
    return pool.execute('SELECT * FROM Customers WHERE customer_id = ?', [id]);
};

exports.create = (firstName, lastName, email, phone) => {
    // Insertar un nuevo cliente
    return pool.execute(
        'INSERT INTO Customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)',
        [firstName, lastName, email, phone]
    );
};
exports.update = (id, firstName, lastName, email, phone) => {
    // Actualizar un cliente existente
    return pool.execute(
        'UPDATE Customers SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE customer_id = ?',
        [firstName, lastName, email, phone, id]
    );
};

exports.remove = (id) => {
    // Eliminar un cliente de la base de datos
    return pool.execute('DELETE FROM Customers WHERE customer_id = ?', [id]);
};
