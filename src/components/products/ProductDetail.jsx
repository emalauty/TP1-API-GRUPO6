// src/components/products/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../asynmock';
import { useCart } from '../../../context/CartContext';
import './Products.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts(); // Traemos todos
        const found = data.find((p) => p.id === parseInt(id));
        if (!found) {
          setError('Producto no encontrado');
        } else {
          setProduct(found);
        }
      } catch (err) {
        console.error(err);
        setError('Error cargando producto');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

  if (loading) return <div className="loading">⚡ Cargando producto...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-detail container">
      <div className="product-detail-card">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
          {product.stock === 0 && <div className="out-of-stock-overlay">Sin Stock</div>}
        </div>
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-detail-category">{product.category}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-stock">
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
          </p>
          <p className="product-detail-price">{formatPrice(product.price)}</p>

          {isInCart(product.id) ? (
            <div>
              <span>✅ En carrito ({getItemQuantity(product.id)})</span>
              <button
                className="btn btn-add-more"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Agregar más
              </button>
            </div>
          ) : (
            <button
              className={`btn ${product.stock === 0 ? 'btn-disabled' : 'btn-primary'}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
