import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Header from './components/layout/Header';
import Home from './components/home/Home';
import ProductList from './components/products/ProductList';
import Cart from './components/cart/Cart';
import Login from './components/auth/Login';
import './App.css';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}