import React, { useState, useEffect } from 'react';
import { productService } from '../../asynmock';
import { useCart } from '../../context/CartContext';
import './Products.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { addToCart, isInCart, getItemQuantity } = useCart();

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
      const data = await productService.getProducts();
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
      const data = await productService.getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      setError('Error cargando productos por categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) return <div className="loading">⚡ Cargando productos gaming...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products container">
      <div className="products-header">
        <h2 className="section-title">Productos Gaming</h2>
        
        {/* Filtro por categorías */}
        <div className="category-filter">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="card product-card">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-img"
              />
              {product.stock === 0 && (
                <div className="out-of-stock-overlay">
                  Sin Stock
                </div>
              )}
            </div>
            
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-details">
                <p className="product-stock">
                  {product.stock > 0 ? (
                    <>Stock: {product.stock} disponibles</>
                  ) : (
                    <span className="no-stock">Sin stock</span>
                  )}
                </p>
                <p className="product-price">{formatPrice(product.price)}</p>
              </div>

              <div className="product-actions">
                {isInCart(product.id) ? (
                  <div className="in-cart-indicator">
                    <span className="in-cart-text">
                      ✅ En carrito ({getItemQuantity(product.id)})
                    </span>
                    <button 
                      className="btn btn-add-more"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      Agregar más
                    </button>
                  </div>
                ) : (
                  <button 
                    className={`btn ${product.stock === 0 ? 'btn-disabled' : 'btn-primary'}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                  </button>
                )}
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