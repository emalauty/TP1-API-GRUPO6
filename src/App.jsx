// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Contexto (proveedor del carrito y autenticación)
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Páginas / Secciones
import Home from './components/home/Home';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/auth/UserProfile';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            {/* Cabecera global */}
            <Header />

            {/* Contenido principal con las rutas */}
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* Catálogo: por defecto orden alfabético (A→Z) */}
                <Route path="/products" element={<ProductList sort="name-asc" />} />
                {/* Detalle de producto */}
                <Route path="/products/:id" element={<ProductDetail />} />
                {/* Carrito */}
                <Route path="/cart" element={<Cart />} />
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<UserProfile />} />
              </Routes>
            </main>

            {/* Pie de página global */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
