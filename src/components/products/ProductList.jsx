// src/components/products/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { productService } from '../../asynmock';
import { Link } from 'react-router-dom';
import './Products.css';

export default function ProductList({ sort, selectedCategory: selectedCategoryProp }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryProp || '');

  // 🔹 Sincronizamos categoría seleccionada desde Home
  useEffect(() => {
    setSelectedCategory(selectedCategoryProp);
  }, [selectedCategoryProp]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProductsByCategory(selectedCategory);
    } else {
      loadProducts();
    }
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let data = await productService.getProducts();

      if (sort === 'alpha') {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(data);
    } catch (err) {
      setError('Error cargando productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const loadProductsByCategory = async (category) => {
    try {
      setLoading(true);
      let data = await productService.getProductsByCategory(category);

      if (sort === 'alpha') {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(data);
    } catch (err) {
      setError('Error cargando productos por categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

  if (loading) return <div className="loading">⚡ Cargando productos gaming...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products container">
      <div className="products-header">
        <h2 className="section-title">Productos Gaming</h2>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="card product-card">
            <div className="product-image-container">
              <Link to={`/products/${product.id}`}>
                <img src={product.image} alt={product.name} className="product-img" />
              </Link>
              {product.stock === 0 && <div className="out-of-stock-overlay">Sin Stock</div>}
            </div>

            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">
                <Link to={`/products/${product.id}`} className="product-name-link">
                  {product.name}
                </Link>
              </h3>
              <p className="product-description">{product.description}</p>

              <div className="product-details">
                <p className="product-stock">
                  {product.stock > 0 ? `Stock: ${product.stock} disponibles` : 'Sin stock'}
                </p>
                <p className="product-price">{formatPrice(product.price)}</p>
              </div>

              {/* 🔹 Nuevo botón: Ver detalle */}
              <div className="product-actions">
                <Link to={`/products/${product.id}`} className="btn btn-primary">
                  Ver Detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="no-products">
          <h3>No se encontraron productos</h3>
          <p>Intenta con otra categoría o revisa más tarde.</p>
        </div>
      )}
    </div>
  );
}
