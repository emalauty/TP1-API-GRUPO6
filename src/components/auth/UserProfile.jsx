import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Auth.css';

export default function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

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
          
          {user?.createdAt && (
            <div className="profile-field">
              <label>Miembro desde:</label>
              <p>{new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="btn btn-secondary">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}