// src/components/products/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Utilizar el endpoint del backend para obtener un producto por su ID
        const fetched = await productService.getProductById(id);
        setProduct(fetched);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error cargando producto');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const currentQuantity = getItemQuantity(product?.id);
  const maxReached = currentQuantity >= product?.stock;

  const handleAddToCart = () => {
    if (product.stock > 0 && !maxReached) {
      addToCart(product);
    }
  };

  const handleRemoveFromCart = () => {
    addToCart(product, -1);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

  if (loading) return <div className="loading">⚡ Cargando producto...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-detail container">
      <button 
        className="btn btn-back" 
        onClick={() => navigate('/products')}
        title="Volver a productos"
      >
        ← Volver a productos
      </button>
      
      <div className="product-detail-card">
        <div className="product-detail-image">
          <img 
            src={product.image || product.imageUrl || 'https://via.placeholder.com/600x600?text=Sin+Imagen'} 
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x600?text=Sin+Imagen';
            }}
          />
          {product.stock === 0 && <div className="out-of-stock-overlay">Sin Stock</div>}
        </div>
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-detail-category">{product.category}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className={`product-detail-stock ${product.stock === 0 ? 'no-stock' : ''}`}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
          </p>
          <p className="product-detail-price">{formatPrice(product.price)}</p>

          {!isAdmin && isAuthenticated && (
            <>
              {isInCart(product.id) ? (
                <div className="cart-actions">
                  <div className="quantity-control">
                    <button
                      className="btn btn-quantity"
                      onClick={handleRemoveFromCart}
                      disabled={getItemQuantity(product.id) <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{getItemQuantity(product.id)}</span>
                    <button
                      className="btn btn-quantity"
                      onClick={handleAddToCart}
                      disabled={getItemQuantity(product.id) >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-info">
                    <span>{getItemQuantity(product.id)} productos agregados</span>
                    <button className="btn btn-primary" onClick={() => navigate('/cart')}>
                      Ver carrito
                    </button>
                  </div>
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
            </>
          )}

          {!isAuthenticated && (
            <button
              className="btn btn-disabled"
              disabled
              title="Debes iniciar sesión para agregar al carrito"
            >
              Inicia sesión para comprar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
