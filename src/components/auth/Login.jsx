import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
      const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`);
      const users = await res.json();
      console.log("Usuarios encontrados:", users);
      if (users.length > 0) {
        console.log("Login exitoso, redirigiendo...");
        setSuccess("Login exitoso.");
        navigate("/");
      } else {
        setError("Email o contraseña incorrectos.");
      }
    } catch {
      setError("No se pudo conectar al servidor.");
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
          <button type="submit" className="btn btn-primary">
            Ingresar
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