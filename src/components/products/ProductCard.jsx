// src/components/products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Card presentacional reutilizable:
 * - Muestra imagen, nombre, descripción, precio, stock, botones.
 * - Respeta clases existentes (.product-card, .product-img, etc.) para no romper el diseño.
 */
export default function ProductCard({ product, onAdd }) {
    const outOfStock = (product?.stock ?? 0) <= 0;

    const formatPrice = (price) =>
        new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

    return (
        <article className="card product-card" role="listitem">
        <div className="product-image-container">
            <Link to={`/products/${product.id}`}>
            <img src={product.image} alt={`Foto de ${product.name}`} className="product-img" loading="lazy" />
            </Link>
            {outOfStock && <div className="out-of-stock-overlay">Sin Stock</div>}
        </div>

        <div className="product-info">
            <span className="product-category">{product.category}</span>
            <h3 className="product-name">
            <Link to={`/products/${product.id}`} className="product-name-link">
                {product.name}
            </Link>
            </h3>
            <p className="product-description">{product.description}</p>

            <div className="product-details">
            <p className={`product-stock ${outOfStock ? 'no-stock' : ''}`}>
                {outOfStock ? 'Sin stock' : `Stock: ${product.stock}`}
            </p>
            <p className="product-price">{formatPrice(product.price)}</p>
            </div>

            <div className="product-actions">
            <Link to={`/products/${product.id}`} className="btn btn-secondary" aria-label={`Ver detalle de ${product.name}`}>
                Ver detalle
            </Link>
            <button
                className={`btn ${outOfStock ? 'btn-disabled' : 'btn-primary'}`}
                onClick={() => onAdd?.(product)}
                disabled={outOfStock}
                aria-disabled={outOfStock}
                title={outOfStock ? 'No hay stock disponible' : 'Agregar al carrito'}
            >
                Agregar
            </button>
            </div>
        </div>
        </article>
    );
}
