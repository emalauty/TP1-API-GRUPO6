import React from 'react';
import './Cart.css';

export default function Cart() {
  return (
    <div className="cart-container container">
      <h2 className="section-title">Tu Carrito</h2>
      
      <div className="cart-content">
        <div className="cart-items">
          <div className="empty-cart">
            <h3>Tu carrito está vacío</h3>
            <p>¿No sabés qué comprar? ¡Miles de productos te esperan!</p>
          </div>
        </div>

        <div className="cart-summary card">
          <h3>Resumen de compra</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
            <div className="summary-item">
              <span>Envío</span>
              <span>$0.00</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>$0.00</span>
            </div>
          </div>
          <button className="btn btn-primary" disabled>
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}