import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../asynmock';
import './MyProducts.css';

export default function MyProducts() {
  const { user, isAuthenticated } = useAuth();
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

  // Cargar productos del usuario
  const loadProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userProducts = await productService.getProductsByUserId(user.id);
      setProducts(userProducts);
    } catch (error) {
      setMessage('Error al cargar productos');
    }
    setLoading(false);
  };

  // Eliminar producto
  const deleteProduct = async (productId) => {
    if (!window.confirm('¿Eliminar este producto?')) return;

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setMessage('Producto eliminado');
    } catch (error) {
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
    } catch (error) {
      setMessage('Error al actualizar stock');
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="my-products-container container">
        <h2>Debes iniciar sesión para ver esta página</h2>
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
        <h2>Mis Productos</h2>
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
          <h3>No tienes productos</h3>
          <p>Agrega tu primer producto</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img 
                src={product.image} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=300&fit=crop';
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
        />
      )}
    </div>
  );
}

// Componente del formulario simplificado
function ProductForm({ product, onClose, onSave }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '',
    image: product?.image || ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Tarjetas Gráficas", "Teclados", "Mouse", "Auriculares",
    "Procesadores", "Motherboards", "Memoria RAM", "Almacenamiento"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        userId: user.id
      };

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
      alert('Error al guardar el producto');
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
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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