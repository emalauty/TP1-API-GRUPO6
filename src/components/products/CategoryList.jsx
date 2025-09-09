import React, { useState, useEffect } from 'react';
import { productService } from '../../asynmock';
import './CategoryList.css';

export default function CategoryList({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="categories-list">
      {categories.length === 0 ? (
        <p>No hay categorías disponibles.</p>
      ) : (
        <ul>
          {categories.map((cat) => (
            <li key={cat} className="category-item">
              <button 
                className="category-button"
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
          <li>
            <button 
              className="category-button"
              onClick={() => onSelectCategory('')}
            >
              Todas
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
