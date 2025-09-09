import React, { useState, useEffect } from 'react';
import { productService } from '../../../asynmock';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error loading products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products container">
      <h2 className="section-title">Productos Gaming</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="card product-card">
            <img 
              src={product.image} 
              alt={product.name}
              className="product-img"
            />
            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            <p className="description">{product.description}</p>
            <p className="stock">Stock: {product.stock}</p>
            <p className="price">${product.price}</p>
            <button 
              className="btn"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}