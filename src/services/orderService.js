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

  /**
   * Cancela un pedido del usuario autenticado.
   * @param {number|string} pedidoId ID del pedido a cancelar
   * @returns {Promise<Object>} Pedido cancelado
   */
  async cancelarMiPedido(pedidoId) {
    const res = await fetch(`${API_BASE}/pedidos/${pedidoId}/cancelar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Error al cancelar el pedido';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  /**
   * Marca un pedido como entregado (recibido por el usuario).
   * @param {number|string} pedidoId ID del pedido
   * @returns {Promise<Object>} Pedido actualizado
   */
  async marcarComoRecibido(pedidoId) {
    const res = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado?estado=ENTREGADO`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Error al marcar pedido como recibido';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  // ========== ENDPOINTS DE ADMIN ==========

  /**
   * Obtiene todos los pedidos (requiere rol ADMIN).
   * @returns {Promise<Array>} Lista de todos los pedidos
   */
  async getAllPedidos() {
    const res = await fetch(`${API_BASE}/pedidos`, {
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

  /**
   * Obtiene un pedido por su ID (requiere rol ADMIN).
   * @param {number|string} pedidoId ID del pedido
   * @returns {Promise<Object>} Pedido encontrado
   */
  async getPedidoById(pedidoId) {
    const res = await fetch(`${API_BASE}/pedidos/${pedidoId}`, {
      headers: {
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Pedido no encontrado';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  /**
   * Filtra pedidos por estado (requiere rol ADMIN).
   * @param {string} estado Estado del pedido (PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO, CANCELADO)
   * @returns {Promise<Array>} Lista de pedidos filtrados
   */
  async getPedidosByEstado(estado) {
    const res = await fetch(`${API_BASE}/pedidos/estado/${estado}`, {
      headers: {
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Error al filtrar pedidos';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  /**
   * Actualiza el estado de un pedido (requiere rol ADMIN).
   * @param {number|string} pedidoId ID del pedido
   * @param {string} nuevoEstado Nuevo estado (PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO, CANCELADO)
   * @returns {Promise<Object>} Pedido actualizado
   */
  async updateEstadoPedido(pedidoId, nuevoEstado) {
    const res = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado?estado=${nuevoEstado}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Error al actualizar estado del pedido';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  /**
   * Elimina un pedido (requiere rol ADMIN).
   * @param {number|string} pedidoId ID del pedido a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async deletePedido(pedidoId) {
    const res = await fetch(`${API_BASE}/pedidos/${pedidoId}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Error al eliminar el pedido';
      throw new Error(errorMessage);
    }
    return true;
  },
};
