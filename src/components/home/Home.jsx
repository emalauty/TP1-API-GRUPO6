import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Bienvenido a GamerTech</h1>
          <p className="subtitle">Tu tienda especializada en equipamiento gaming</p>
          <Link to="/products" className="btn btn-primary">Ver Productos</Link>
        </div>
      </section>

      <section className="features container">
        <h2>¿Por qué elegirnos?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>✨ Productos Premium</h3>
            <p>Las mejores marcas gaming del mercado</p>
          </div>
          <div className="feature-card">
            <h3>🚚 Envío Gratis</h3>
            <p>En compras superiores a $50.000</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Compra Segura</h3>
            <p>Garantía en todos nuestros productos</p>
          </div>
        </div>
      </section>
    </div>
  );
}