import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>GamerTech</h1>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className="btn">Inicio</Link>
          <Link to="/products" className="btn">Productos</Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="btn cart-btn">
            🛒 Carrito
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>
          <Link to="/login" className="btn">👤 Login</Link>
        </div>
      </div>
    </header>
  );
}