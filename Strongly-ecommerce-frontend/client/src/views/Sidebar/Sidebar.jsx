import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { categoryService } from "../../services/categoryService";

export default function Sidebar({ onCategorySelect, onSortChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    load();
  }, []);

  return (
    <aside className="sidebar">
      <h3>Filtrar por</h3>
      <p>Categorías</p>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <label>
              <input
                type="checkbox"
                onChange={(e) => onCategorySelect(cat.id, e.target.checked)}
              />
              {cat.name}
            </label>
          </li>
        ))}
      </ul>

      <hr />

      <h4>Ordenar por precio</h4>
      <div className="sort-options">
        <label>
          <input
            type="radio"
            name="sort"
            onChange={() => onSortChange("asc")}
          />
          Más barato primero
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            onChange={() => onSortChange("desc")}
          />
          Más caro primero
        </label>
      </div>
    </aside>
  );
}
