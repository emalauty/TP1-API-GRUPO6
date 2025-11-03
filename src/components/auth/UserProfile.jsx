import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import './Auth.css';

export default function UserProfile() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="auth-container container">
      <div className="auth-card card">
        <h2 className="section-title">Mi Perfil</h2>

        <div className="profile-info">
          <div className="profile-field">
            <label>Nombre de usuario:</label>
            <p>{user?.username}</p>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <p>{user?.email}</p>
          </div>

          <div className="profile-field">
            <label>Nombre:</label>
            <p>{user?.name}</p>
          </div>

          <div className="profile-field">
            <label>Apellido:</label>
            <p>{user?.apellido}</p>
          </div>

          <div className="profile-field">
            <label>Rol:</label>
            <p className={`role-badge ${user?.role === 'ADMIN' ? 'role-admin' : 'role-user'}`}>
              {user?.role === 'ADMIN' ? '👑 Administrador' : '🛒 Cliente'}
            </p>
            {user?.role === 'ADMIN' && (
              <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                Puedes gestionar productos y pedidos del sistema
              </small>
            )}
          </div>

          {user?.createdAt && (
            <div className="profile-field">
              <label>Miembro desde:</label>
              <p>{new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
            </div>
          )}
        </div>

        <div className="profile-actions">
          {/* Enlace a Mis pedidos / Gestión de pedidos */}
          <Link to="/orders" className="btn btn-primary">
            {user?.role === 'ADMIN' ? '🛠️ Gestión de Pedidos' : '📋 Mis Pedidos'}
          </Link>

          {/* Enlace a Gestionar Productos solo para ADMIN */}
          {user?.role === 'ADMIN' && (
            <Link to="/my-products" className="btn btn-success" style={{ marginLeft: '1rem' }}>
              🛠️ Gestionar Productos
            </Link>
          )}

          <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
