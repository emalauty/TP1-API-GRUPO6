import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!form.email || !form.password) {
      setError("Completa ambos campos.");
      return;
    }

    try {
      const result = await login(form.email, form.password);
      
      if (result.success) {
        setSuccess("Login exitoso.");
        console.log("Usuario autenticado:", result.user);
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Error inesperado. Intenta nuevamente.");
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="auth-container container">
      <div className="auth-card card">
        <h2 className="section-title">Iniciar Sesión</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              name="email"
              className="input" 
              placeholder="tu@email.com" 
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              name="password"
              className="input" 
              placeholder="********" 
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        {error && <p className="auth-message error">{error}</p>}
        {success && <p className="auth-message success">{success}</p>}
        <p className="auth-links">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </div>
  );
}