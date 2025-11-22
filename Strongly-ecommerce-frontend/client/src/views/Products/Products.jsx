import React, { useEffect, useState } from "react";
import ListCards from "../../components/ListCards/ListCards.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productsSlice.js";

export default function Products() {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.products || {});

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategorySelect = (categoryId, checked) => {
    setSelectedCategories((prev) => {
      if (checked) return [...prev, categoryId];
      return prev.filter((id) => id !== categoryId);
    });
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const filtered = items.filter((p) => {
    if ((p.stock ?? 0) <= 0) return false;
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(p.categoryId) || selectedCategories.includes(p.category);
  });

  const finalProducts = [...filtered];
  if (sortOrder === "asc") finalProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") finalProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="products-page-container">
      <Sidebar onCategorySelect={handleCategorySelect} onSortChange={handleSortChange} />
      <div className="products-main-content">
        <h2>Productos disponibles</h2>

        {loading && <p>Cargando publicaciones... </p>}
        {error && <p style={{ color: "red" }}>Error al cargar las publicaciones: {error}</p>}

        {!loading && !error && <ListCards productos={finalProducts} />}
      </div>
    </div>
  );
}
