import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ categories = [], onCategorySelect, onSortChange, onPriceRangeChange }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    onPriceRangeChange(value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    onPriceRangeChange(minPrice, value);
  };

  const handleClearPriceRange = () => {
    setMinPrice("");
    setMaxPrice("");
    onPriceRangeChange("", "");
  };

  return (
    <aside className="sidebar">
      <h3>Filtrar por</h3>
      <h4>Categorías</h4>

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

      <h4>Rango de precios</h4>
      <div className="price-range-filter">
        <div className="price-input-group">
          <label>Mínimo</label>
          <input
            type="number"
            className="price-input"
            placeholder="$0"
            value={minPrice}
            onChange={handleMinPriceChange}
            min="0"
          />
        </div>
        <div className="price-input-group">
          <label>Máximo</label>
          <input
            type="number"
            className="price-input"
            placeholder="$999999"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            min="0"
          />
        </div>
        {(minPrice || maxPrice) && (
          <button className="clear-price-btn" onClick={handleClearPriceRange}>
            Limpiar
          </button>
        )}
      </div>

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
        <br></br>
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
