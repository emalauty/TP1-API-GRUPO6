// src/components/products/ProductSearch.jsx
import React from 'react';

/**
 * Input controlado de búsqueda:
 * - Usa clase global .input para respetar tu diseño.
 * - El estado vive en ProductList.
 */
export default function ProductSearch({ value, onChange }) {
    return (
        <div className="product-search">
        <label htmlFor="catalog-search" className="sr-only">Buscar productos</label>
        <input
            id="catalog-search"
            type="search"
            className="input"
            placeholder="Buscar por nombre o descripción…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Buscar productos"
        />
        </div>
    );
}
