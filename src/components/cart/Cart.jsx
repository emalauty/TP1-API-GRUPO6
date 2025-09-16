import React, { useState } from 'react';
import './Cart.css';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

export default function Cart() {
  const { items, totalAmount, totalItems, processCheckout } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'

  // Formatear precio a pesos argentinos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Manejar el proceso de checkout
  const handleCheckout = async () => {
    setIsProcessing(true);
    setCheckoutMessage('');
    
    const result = await processCheckout();
    
    setIsProcessing(false);
    setCheckoutMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    // Limpiar el mensaje después de 5 segundos
    if (result.success) {
      setTimeout(() => {
        setCheckoutMessage('');
        setMessageType('');
      }, 5000);
    }
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
          
          {checkoutMessage && (
            <div className={`checkout-message ${messageType}`}>
              {checkoutMessage}
            </div>
          )}
          
          <button 
            className="btn btn-primary" 
            disabled={items.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? 'Procesando...' : 'Proceder al pago'}
          </button>
        </div>
      </div>
    </div>
  );
}