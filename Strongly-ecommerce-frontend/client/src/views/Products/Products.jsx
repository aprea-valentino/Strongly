import React, { useEffect, useState } from "react";
import ListCards from "../../components/ListCards/ListCards";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Products.css";
import { productsService } from "../../services/productsService"; 

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  // 🔹 Cargar todos los productos
  const cargarTodosLosProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await productsService.getAllProducts();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTodosLosProductos();
  }, []);

  // 🔹 Manejar selección/deselección de categorías
  const handleCategorySelect = async (categoryId, checked) => {
    setCargando(true);
    setError(null);

    const updatedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    setSelectedCategories(updatedCategories);

    if (updatedCategories.length === 0) {
      await cargarTodosLosProductos();
      return;
    }

    try {
      const responses = await Promise.all(
        updatedCategories.map((id) =>
          productsService.getProductsByCategory(id)
        )
      );
      const allProducts = responses.flat();
      const uniqueProducts = allProducts.filter(
        (p, index, self) => index === self.findIndex((x) => x.id === p.id)
      );
      setProductos(uniqueProducts);
    } catch (err) {
      console.error("Error al filtrar productos:", err);
      setError("No se pudieron cargar los productos filtrados");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Manejo del ordenamiento
  const handleSortChange = (order) => {
    setSortOrder(order);
    const sorted = [...productos];
    if (order === "asc") sorted.sort((a, b) => a.price - b.price);
    if (order === "desc") sorted.sort((a, b) => b.price - a.price);
    setProductos(sorted);
  };

  return (
    <div className="products-page-container">
      <Sidebar
        onCategorySelect={handleCategorySelect}
        onSortChange={handleSortChange}
      />
      <div className="products-main-content">
        <h2>Productos disponibles</h2>

        {cargando && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!cargando && !error && (
          // Pasamos solo productos con stock positivo
          <ListCards productos={productos.filter(p => (p.stock ?? 0) > 0)} />
        )}
      </div>
    </div>
  );
}
