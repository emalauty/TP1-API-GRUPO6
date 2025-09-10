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
          
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="user-greeting">
                👤 Hola, {user?.username || user?.name || user?.email}
              </Link>
              <button onClick={handleLogout} className="btn btn-logout">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn">👤 Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}