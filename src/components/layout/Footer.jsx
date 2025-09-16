// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
        <div className="container footer-content">
            <p className="footer-copy">© {currentYear} GamerTech. Todos los derechos reservados.</p>
            <p className="footer-desc">
            Expertos en equipamiento gaming y tecnología. Contáctanos a&nbsp;
            <a href="mailto:contacto@gamertech.com" className="footer-link">contacto@gamertech.com</a>
            </p>
            <div className="footer-links">
            <Link to="/about" className="footer-link">Nosotros</Link>
            <Link to="/privacy" className="footer-link">Política de privacidad</Link>
            <Link to="/terms" className="footer-link">Términos y condiciones</Link>
            </div>
        </div>
        </footer>
    );
}
