// Servicio para interactuar con la API del backend.
// Ajusta API_BASE si tu backend corre en otra URL o puerto.

const API_BASE = 'http://localhost:8080/api';

// Devuelve cabeceras que incluyan el token JWT en caso de estar presente en localStorage.
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const productService = {
  /**
   * Obtiene todos los productos disponibles (endpoint público).
   */
  async getProducts() {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) {
      throw new Error('Error cargando productos');
    }
    return await res.json();
  },

  /**
   * Obtiene un producto por su ID (endpoint público).
   * @param {number|string} id Identificador del producto
   */
  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
      throw new Error('Producto no encontrado');
    }
    return await res.json();
  },

  /**
   * Obtiene productos filtrados por categoría (endpoint público).
   * @param {string} category Nombre de la categoría
   */
  async getProductsByCategory(category) {
    const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`);
    if (!res.ok) {
      throw new Error('Error cargando productos por categoría');
    }
    return await res.json();
  },

  /**
   * Obtiene todas las categorías disponibles (endpoint público).
   */
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      throw new Error('Error cargando categorías');
    }
    return await res.json();
  },

  /**
   * Obtiene una categoría por su ID (endpoint público).
   * @param {number|string} id ID de la categoría
   */
  async getCategoryById(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`);
    if (!res.ok) {
      throw new Error('Categoría no encontrada');
    }
    return await res.json();
  },

  /**
   * Crea una nueva categoría (requiere autenticación).
   * @param {Object} categoryData Datos de la categoría { name, description }
   */
  async createCategory(categoryData) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(categoryData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Error al crear la categoría';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  /**
   * Actualiza una categoría existente (requiere autenticación).
   * @param {number|string} id ID de la categoría
   * @param {Object} categoryData Datos actualizados { name, description }
   */
  async updateCategory(id, categoryData) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(categoryData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Error al actualizar la categoría';
      throw new Error(errorMessage);
    }
    return await res.json();
  },

  /**
   * Elimina una categoría (requiere autenticación).
   * @param {number|string} id ID de la categoría
   */
  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || 'Error al eliminar la categoría';
      throw new Error(errorMessage);
    }
    return true;
  },

  /**
   * Obtiene los productos creados por un usuario específico (requiere autenticación).
   * @param {number|string} userId ID del usuario
   */
  async getProductsByUserId(userId) {
    const res = await fetch(`${API_BASE}/products/user/${userId}`, {
      headers: {
        ...authHeaders(),
      },
    });
    if (!res.ok) {
      throw new Error('Error cargando productos del usuario');
    }
    return await res.json();
  },

  /**
   * Actualiza el stock de un producto (requiere autenticación).
   * @param {number|string} productId ID del producto
   * @param {number} newStock Nuevo valor de stock
   */
  async updateProductStock(productId, newStock) {
    const res = await fetch(`${API_BASE}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ stock: newStock }),
    });
    if (!res.ok) {
      throw new Error('Error al actualizar el stock');
    }
    return await res.json();
  },

  /**
   * Crea un nuevo producto (requiere autenticación).
   * @param {Object} productData Datos del producto
   */
  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      throw new Error('Error al crear el producto');
    }
    return await res.json();
  },

  /**
   * Actualiza un producto existente (requiere autenticación).
   * @param {number|string} id ID del producto
   * @param {Object} productData Datos actualizados
   */
  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      throw new Error('Error al actualizar el producto');
    }
    return await res.json();
  },

  /**
   * Elimina un producto (requiere autenticación).
   * @param {number|string} id ID del producto
   */
  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error('Error al eliminar el producto');
    }
    return true;
  },
};
