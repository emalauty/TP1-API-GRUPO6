import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

export default function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container-header">
        
        {/* Logo siempre a la izquierda */}
        <div className="header-left">
          <Link to="/" className="logo">
            <h1>GamerTech</h1>
          </Link>
        </div>

        {/* Menú y acciones a la derecha */}
        <div className="header-right">
          <nav className="nav-menu">
            <Link to="/" className="btn">Inicio</Link>
            <Link to="/products" className="btn">Productos</Link>
            {isAuthenticated && (
              <Link to="/my-products" className="btn">Mis Productos</Link>
            )}
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="btn cart-btn">
              🛒 Carrito
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="user-greeting">
                  👤 Hola, {user?.username || user?.name || user?.email}
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn">👤 Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
