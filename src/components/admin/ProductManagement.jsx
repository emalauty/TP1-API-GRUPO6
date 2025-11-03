import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductModal from './ProductModal';
import './ProductManagement.css';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      setDeletingId(productId);
      await productService.deleteProduct(productId);
      await loadData();
      alert('Producto eliminado exitosamente');
    } catch (err) {
      alert(err.message || 'Error al eliminar producto');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
      } else {
        await productService.createProduct(productData);
      }
      await loadData();
      setShowModal(false);
      alert(editingProduct ? 'Producto actualizado' : 'Producto creado');
    } catch (err) {
      throw err;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return <div className="loading-state">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Gestión de Productos</h2>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          + Agregar Producto
        </button>
      </div>

      <div className="products-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-message">
                  No hay productos disponibles
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img
                      src={product.imageUrl || product.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                      alt={product.name}
                      className="product-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                      }}
                    />
                  </td>
                  <td className="product-name">{product.name}</td>
                  <td>{product.category?.name || 'Sin categoría'}</td>
                  <td className="product-price">{formatPrice(product.price)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEditProduct(product)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deletingId === product.id}
                      title="Eliminar"
                    >
                      {deletingId === product.id ? '⏳' : '🗑️'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
