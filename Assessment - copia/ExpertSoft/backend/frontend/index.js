import { useState, useEffect, useCallback } from 'react';

// Se asume que Tailwind CSS está disponible en el entorno de Canvas.
// Para un proyecto local, necesitarías configurarlo.
const App = () => {
  // --- Estados de la aplicación ---
  // Estado para almacenar la lista de clientes
  const [customers, setCustomers] = useState([]);
  // Estado para los datos del formulario de un nuevo cliente o para editar
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  // Estado para la búsqueda de clientes
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para el cliente que se está editando
  const [editingCustomer, setEditingCustomer] = useState(null);
  // Estado para los resultados de las consultas avanzadas
  const [advancedQueryResults, setAdvancedQueryResults] = useState({});
  // Estado para el mensaje de la aplicación (éxito o error)
  const [message, setMessage] = useState('');
  // Estado para el indicador de carga
  const [isLoading, setIsLoading] = useState(false);
  
  // GUARDIAN: Nuevo estado para simular permisos de usuario
  const [hasPermission, setHasPermission] = useState(true);

  // --- Constantes de la API ---
  // AQUI DEBES REEMPLAZAR CON LA URL DE TU BACKEND REAL
  const API_URL = 'http://localhost:3000/api';

  // --- Funciones de comunicación con el backend (simuladas) ---
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Llama a la API para obtener todos los clientes
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setMessage('Error al cargar la lista de clientes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCustomer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Llama a la API para crear un nuevo cliente
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage('Cliente creado exitosamente.');
        setFormData({ first_name: '', last_name: '', email: '', phone: '' });
        fetchCustomers();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
      setMessage('Error de conexión o validación.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Llama a la API para actualizar un cliente
      const response = await fetch(`${API_URL}/customers/${editingCustomer.customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage('Cliente actualizado exitosamente.');
        setEditingCustomer(null);
        setFormData({ first_name: '', last_name: '', email: '', phone: '' });
        fetchCustomers();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      setMessage('Error de conexión o validación.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (customerId) => {
    // GUARDIAN: Se agrega una validación de permisos antes de la eliminación
    if (!hasPermission) {
        setMessage('No tienes permisos para eliminar clientes.');
        return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setIsLoading(true);
      try {
        // Llama a la API para eliminar un cliente. Se envía el token en los headers.
        const response = await fetch(`${API_URL}/customers/${customerId}`, {
          method: 'DELETE',
          headers: { 'x-permission-token': 'expertsoft-admin-token' } // Simulación del token
        });
        if (response.ok) {
          setMessage('Cliente eliminado exitosamente.');
          fetchCustomers();
        } else {
          const errorData = await response.json();
          setMessage(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        setMessage('Error de conexión.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchAdvancedQuery = async (queryName, param = '') => {
    setIsLoading(true);
    try {
      // Llama a las rutas de reportes avanzados
      const response = await fetch(`${API_URL}/reports/${queryName}${param ? `/${param}` : ''}`);
      const data = await response.json();
      setAdvancedQueryResults(prev => ({ ...prev, [queryName]: data }));
    } catch (error) {
      console.error(`Error al obtener resultados de la consulta '${queryName}':`, error);
      setMessage(`Error al cargar la consulta '${queryName}'.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Efecto para cargar los clientes al iniciar la app ---
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // --- Lógica del componente ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startEditing = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
    });
  };

  const cancelEditing = () => {
    setEditingCustomer(null);
    setFormData({ first_name: '', last_name: '', email: '', phone: '' });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Encabezado y título */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
            Dashboard de Gestión de Clientes
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Gestión de clientes y consultas financieras para ExpertSoft
          </p>
        </header>

        {/* Mensajes de estado */}
        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg shadow-md transition-opacity duration-300">
            <p className="font-semibold">{message}</p>
          </div>
        )}

        {/* Sección de permisos */}
        <div className="flex items-center justify-center space-x-4">
            <span className="text-gray-700">Permiso para eliminar clientes:</span>
            <button
                onClick={() => setHasPermission(!hasPermission)}
                className={`font-bold py-2 px-4 rounded-lg transition-colors ${hasPermission ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
            >
                {hasPermission ? 'Activado' : 'Desactivado'}
            </button>
        </div>


        {/* Formulario de CRUD */}
        <section className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingCustomer ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}
          </h2>
          <form onSubmit={editingCustomer ? updateCustomer : createCustomer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end items-end space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                {editingCustomer ? 'Guardar Cambios' : 'Añadir Cliente'}
              </button>
              {editingCustomer && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Búsqueda y listado de clientes */}
        <section className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Clientes</h2>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-auto p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-lg text-gray-500">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Teléfono</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                      <tr key={customer.customer_id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-800">{customer.customer_id}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{customer.first_name} {customer.last_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{customer.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{customer.phone}</td>
                        <td className="py-3 px-4 flex space-x-2">
                          <button
                            onClick={() => startEditing(customer)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                          >
                            Editar
                          </button>
                          {/* Botón de eliminar con el guardián. Se desactiva si no hay permiso. */}
                          <button
                            onClick={() => deleteCustomer(customer.customer_id)}
                            className={`text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors ${hasPermission ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'}`}
                            disabled={!hasPermission}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">No se encontraron clientes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sección de Consultas Avanzadas */}
        <section className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Consultas Avanzadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Consulta 1: Total pagado por cada cliente */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Total pagado por cliente</h3>
              <button
                onClick={() => fetchAdvancedQuery('total_payments_by_customer')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Ejecutar
              </button>
              {advancedQueryResults.total_payments_by_customer && (
                <ul className="mt-4 space-y-2">
                  {advancedQueryResults.total_payments_by_customer.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span className="font-semibold">{item.customer_name}:</span>
                      <span className="text-gray-600">${item.total_paid.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Consulta 2: Facturas pendientes */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Facturas Pendientes</h3>
              <button
                onClick={() => fetchAdvancedQuery('pending_invoices')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Ejecutar
              </button>
              {advancedQueryResults.pending_invoices && (
                <ul className="mt-4 space-y-2">
                  {advancedQueryResults.pending_invoices.map((item, index) => (
                    <li key={index} className="text-sm">
                      <p className="font-semibold">{item.customer_name} ({item.email})</p>
                      <p className="text-gray-600">Factura #{item.invoice_id} - Monto: ${item.total_amount.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Consulta 3: Transacciones por plataforma (ejemplo Nequi) */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Transacciones de Nequi</h3>
              <button
                onClick={() => fetchAdvancedQuery('transactions_by_platform', 'Nequi')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Ejecutar
              </button>
              {advancedQueryResults.transactions_by_platform && (
                <ul className="mt-4 space-y-2">
                  {advancedQueryResults.transactions_by_platform.map((item, index) => (
                    <li key={index} className="text-sm">
                      <p className="font-semibold">{item.customer_name}:</p>
                      <p className="text-gray-600">Factura #{item.invoice_id} - Monto: ${item.amount.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default App;
