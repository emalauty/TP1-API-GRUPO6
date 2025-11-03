import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import './MyProducts.css';

export default function MyProducts() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  // Formatear precio a pesos argentinos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Si es ADMIN, cargar todos los productos del sistema
        // Si es usuario normal, cargar solo sus productos (aunque ya no deberían acceder)
        const allProducts = isAdmin 
          ? await productService.getAllProducts()
          : await productService.getProductsByUserId(user.id);
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        // Si el error es 404, significa que no hay productos
        setProducts([]);
        if (!error.message.includes('404')) {
          setMessage('Error al cargar productos');
        }
      }
      setLoading(false);
    };

    loadProducts();
  }, [user, isAdmin]);

  // Eliminar producto
  const deleteProduct = async (productId) => {
    if (!window.confirm('¿Eliminar este producto?')) return;

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setMessage('Producto eliminado');
    } catch {
      setMessage('Error al eliminar');
    }
  };

  // Actualizar stock
  const updateStock = async (productId, newStock) => {
    try {
      await productService.updateProductStock(productId, newStock);
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      ));
      setMessage('Stock actualizado');
    } catch {
      setMessage('Error al actualizar stock');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="my-products-container container">
        <h2>Debes iniciar sesión para ver esta página</h2>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="my-products-container container">
        <div className="access-denied card">
          <h2>⛔ Acceso Denegado</h2>
          <p>Solo los administradores pueden gestionar productos.</p>
          <p>Si necesitas ayuda, contacta al administrador del sistema.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="my-products-container container">
        <div className="access-denied card">
          <h2>⛔ Acceso Denegado</h2>
          <p>Solo los administradores pueden gestionar productos.</p>
          <p>Si necesitas ayuda, contacta al administrador del sistema.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-products-container container">
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  return (
    <div className="my-products-container container">
      <div className="header">
        <h2>�️ Gestión de Productos</h2>
        <span className="role-badge admin">ADMIN</span>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Agregar Producto
        </button>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty">
          <h3>No hay productos registrados</h3>
          <p>Comienza agregando productos al catálogo de GamerTech</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Agregar primer producto
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img 
                src={product.image || product.imageUrl || 'https://via.placeholder.com/400x300?text=Sin+Imagen'} 
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                }}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">{formatPrice(product.price)}</p>
                
                <div className="stock-control">
                  <label>Stock:</label>
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => setEditingProduct(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar/editar */}
      {(showForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={(product) => {
            if (editingProduct) {
              setProducts(products.map(p => p.id === product.id ? product : p));
              setMessage('Producto actualizado');
            } else {
              setProducts([...products, product]);
              setMessage('Producto agregado');
            }
            setShowForm(false);
            setEditingProduct(null);
          }}
          onMessage={setMessage}
        />
      )}
    </div>
  );
}

// Componente del formulario simplificado
function ProductForm({ product, onClose, onSave, onMessage }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    stock: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  // Cargar categorías desde el backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await productService.getCategories();
        console.log('✅ Categorías del backend:', categoriesData);
        
        // Verificar si son strings (backend viejo) u objetos (backend nuevo)
        if (categoriesData.length > 0) {
          if (typeof categoriesData[0] === 'string') {
            // Backend devuelve strings, necesitamos crear objetos con IDs
            const categoriesWithIds = categoriesData.map((name, index) => ({
              id: index + 1,
              name: name
            }));
            setCategories(categoriesWithIds);
          } else {
            // Backend devuelve objetos completos { id, name, description, ... }
            setCategories(categoriesData);
          }
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
        if (onMessage) onMessage('Error al cargar categorías');
      }
    };
    loadCategories();
  }, [onMessage]);

  // Inicializar formData cuando se cargan las categorías y el producto
  useEffect(() => {
    if (categories.length > 0 && product) {
      // Buscar el categoryId basándose en el nombre de la categoría
      const categoryMatch = categories.find(cat => cat.name === product.category);
      setFormData({
        name: product.name || '',
        categoryId: categoryMatch?.id?.toString() || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        image: product.image || ''
      });
    }
  }, [categories, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔍 FormData antes de procesar:', formData);

    try {
      const productData = {
        name: formData.name,
        categoryId: parseInt(formData.categoryId), // Convertir a número
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image,
        userId: user.id
      };

      console.log('📤 Enviando producto:', productData);

      if (product) {
        // Editar producto existente
        const updatedProduct = await productService.updateProduct(product.id, productData);
        onSave(updatedProduct);
      } else {
        // Crear nuevo producto
        const newProduct = await productService.createProduct(productData);
        onSave(newProduct);
      }
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      alert('Error al guardar el producto: ' + error.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{product ? 'Editar Producto' : 'Agregar Producto'}</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio (ARS) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL Imagen</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
