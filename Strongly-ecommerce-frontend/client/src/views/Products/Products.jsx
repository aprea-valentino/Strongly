import React, { useEffect, useState } from "react";
import ListCards from "../../components/ListCards/ListCards.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productsSlice.js";
import { fetchCategories } from "../../redux/CategoriesSlice.js";
import { useSearchParams } from 'react-router-dom';

export default function Products() {
  const dispatch = useDispatch();
   const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');

  // productos
  const productsState = useSelector((state) => state.products);
  const items = productsState?.items ?? [];
  const loading = productsState?.loading ?? false;
  const error = productsState?.error ?? null;

  // categorías
  const categories = useSelector((state) => state.categories.items ?? []);

  // filtros seleccionados
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // cargar datos
  useEffect(() => {
    dispatch(fetchProducts(searchQuery));
    dispatch(fetchCategories());
  }, [dispatch, searchQuery]);

  // cuando se selecciona/deselecciona una categoría
  const handleCategorySelect = (categoryId, checked) => {
    setSelectedCategories((prev) =>
      checked
        ? [...prev, categoryId] // agregar
        : prev.filter((id) => id !== categoryId) // sacar
    );
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const filtered = items.filter((p) => {

    if ((p.stock ?? 0) <= 0) return false;

    // Filtro por categoría
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.categoryid)) {
      return false;
    }

    // Filtro por rango de precios (usando precio con descuento)
    let finalPrice = Number(p.price);
    if (p.descuento && Number(p.descuento) > 0) {
      finalPrice = finalPrice - (finalPrice * Number(p.descuento) / 100);
    }
    
    const minPrice = priceRange.min ? Number(priceRange.min) : 0;
    const maxPrice = priceRange.max ? Number(priceRange.max) : Infinity;

    if (finalPrice < minPrice || finalPrice > maxPrice) {
      return false;
    }

    return true;
  });

  // ordenar si eligió asc o desc

  const finalProducts = [...filtered];
  if (sortOrder === "asc") finalProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") finalProducts.sort((a, b) => b.price - a.price);
console.log(finalProducts)
  return (
    <div className="products-page-container">
      <Sidebar
        categories={categories}
        onCategorySelect={handleCategorySelect}
        onSortChange={handleSortChange}
        onPriceRangeChange={handlePriceRangeChange}
      />

      <div className="products-main-content">
        <h2>Productos disponibles</h2>

        {loading && <p>Cargando publicaciones... </p>}
        {error && <p style={{ color: "red" }}>Error al cargar: {error}</p>}

        {!loading && !error && <ListCards productos={finalProducts} />}
      </div>
    </div>
  );
}

