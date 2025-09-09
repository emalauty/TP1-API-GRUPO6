import React from 'react';
import './Auth.css';

export default function Login() {
  return (
    <div className="auth-container container">
      <div className="auth-card card">
        <h2 className="section-title">Iniciar Sesión</h2>
        
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              className="input" 
              placeholder="tu@email.com" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              className="input" 
              placeholder="********" 
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Ingresar
          </button>
        </form>

        <p className="auth-links">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </div>
  );
}