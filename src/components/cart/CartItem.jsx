import React from 'react';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item, isCheckingOut }) {
  const { removeFromCart, updateQuantity } = useCart();

  // Formatear precio a pesos argentinos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else if (newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="cart-item card">
      <img 
        src={item.image || item.imageUrl || 'https://via.placeholder.com/120x120?text=Sin+Imagen'} 
        alt={item.name}
        className="cart-item-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/120x120?text=Sin+Imagen';
        }}
      />
      
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-category">{item.category}</p>
        <p className="cart-item-price">{formatPrice(item.price)}</p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isCheckingOut}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isCheckingOut || item.quantity >= item.stock}
            aria-label="Aumentar cantidad"
          >
            {item.quantity >= item.stock ? 'Máx' : '+'}
          </button>
        </div>

        <div className="item-total">
          {formatPrice(item.price * item.quantity)}
        </div>

        <button 
          className="remove-btn"
          onClick={() => removeFromCart(item.id)}
          disabled={isCheckingOut}
          title="Eliminar producto"
          aria-label={`Eliminar ${item.name} del carrito`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}