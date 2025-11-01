// Servicios para interactuar con los endpoints de pedidos del backend.
// Se incluyen funciones para crear un pedido y obtener los pedidos del usuario autenticado.

const API_BASE = 'http://localhost:8080/api';

// Devuelve headers con token JWT si existe
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const orderService = {
  /**
   * Crea un nuevo pedido para el usuario autenticado.
   * @param {Object} pedidoData Objeto con dirección, teléfono, notas e items
   * @returns {Promise<Object>} Pedido creado
   */
  async createPedido(pedidoData) {
    const res = await fetch(`${API_BASE}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(pedidoData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Error al crear el pedido';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  /**
   * Obtiene los pedidos del usuario autenticado.
   * @returns {Promise<Array>} Lista de pedidos
   */
  async getMisPedidos() {
    const res = await fetch(`${API_BASE}/pedidos/mis-pedidos`, {
      headers: {
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Error al obtener pedidos';
      throw new Error(errorMessage);
    }
    return await res.json();
  },
};
