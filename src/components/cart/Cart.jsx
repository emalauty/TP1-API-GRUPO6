import React from 'react';
import './Cart.css';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

export default function Cart() {
  const { items, totalAmount, totalItems } = useCart();

  // Formatear precio a pesos argentinos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="cart-container container">
      <h2 className="section-title">Tu Carrito</h2>
      <div className="cart-content">
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <h3>Tu carrito está vacío</h3>
              <p>¿No sabés qué comprar? ¡Miles de productos te esperan!</p>
            </div>
          ) : (
            items.map(item => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </div>

        <div className="cart-summary card">
          <h3>Resumen de compra</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span>Productos</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="summary-item">
              <span>Envío</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>
          <button className="btn btn-primary" disabled={items.length === 0}>
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}