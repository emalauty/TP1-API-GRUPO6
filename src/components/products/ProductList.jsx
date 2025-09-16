// src/components/products/ProductList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../../asynmock';
import { useCart } from '../../context/CartContext';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';
import './Products.css';

// 🔧 Ordenamientos definidos fuera del componente (evita warnings en useMemo)
const SORTERS = {
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  alpha: (a, b) => a.name.localeCompare(b.name), // compatibilidad con sort="alpha"
};

/**
 * Listado de productos:
 * - Carga inicial desde asynmock
 * - Filtra por categoría (prop desde Home)
 * - Búsqueda por texto
 * - Ordenamiento configurable
 * - Skeletons + manejo de errores
 */
export default function ProductList({ sort = 'name-asc', selectedCategory: selectedCategoryProp = '' }) {
  const { addToCart } = useCart();

  // Estado base
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Control de UI
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryProp || '');
  const [sortKey, setSortKey] = useState(sort);

  // 🔄 Mantener en sync la categoría proveniente de Home
  useEffect(() => {
    setSelectedCategory(selectedCategoryProp || '');
  }, [selectedCategoryProp]);

  // 📥 Carga inicial de productos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        if (mounted) {
          setAllProducts(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Error cargando productos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // 🧮 Búsqueda + filtro por categoría + orden
  const products = useMemo(() => {
    let list = [...allProducts];

    if (selectedCategory) {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle)
      );
    }

    const sorter = SORTERS[sortKey] || SORTERS['name-asc'];
    list.sort(sorter);
    return list;
  }, [allProducts, selectedCategory, q, sortKey]);

  // 🛒 Agregar al carrito (guard por stock)
  const handleAdd = (product) => {
    if (!product || (product.stock ?? 0) <= 0) return;
    addToCart(product, 1);
  };

  // ⏳ Skeletons
  if (loading) {
    return (
      <div className="product-list">
        <div className="products-header">
          <div className="skeleton skeleton-input" />
          <div className="skeleton skeleton-select" />
        </div>
        <div className="products-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  // ⚠️ Error
  if (error) {
    return (
      <div className="container">
        <p role="alert">{error}</p>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  // ✅ Render normal
  return (
    <section className="product-list">
      {/* Header del catálogo: búsqueda + orden (reutiliza .products-header existente) */}
      <div className="products-header">
        {/* Buscar */}
        <ProductSearch value={q} onChange={setQ} />

        {/* Orden */}
        <div className="category-filter">
          <label htmlFor="sort-select" className="sr-only">Ordenar</label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Ordenar productos"
            className="category-select"
          >
            <option value="name-asc">Nombre (A→Z)</option>
            <option value="name-desc">Nombre (Z→A)</option>
            <option value="price-asc">Precio (menor a mayor)</option>
            <option value="price-desc">Precio (mayor a menor)</option>
          </select>
        </div>
      </div>

      {/* Grilla de productos (usa .products-grid y .product-card que ya tenés) */}
      <div className="products-grid" role="list" aria-label="Listado de productos">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>

      {/* Vacío */}
      {products.length === 0 && (
        <div className="no-products">
          <h3>No se encontraron productos</h3>
          <p>Probá con otra categoría o búsqueda.</p>
        </div>
      )}
    </section>
  );
}
