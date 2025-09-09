import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
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
          <Link to="/cart" className="btn">🛒 Carrito</Link>
          <Link to="/login" className="btn">👤 Login</Link>
        </div>
      </div>
    </header>
  );
}