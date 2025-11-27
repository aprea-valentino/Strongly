import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productsSlice.js";
import ListCards from "../components/ListCards/ListCards.jsx";
import "./Products/Products.css";

const Offers = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products);
  const items = productsState?.items ?? [];
  const loading = productsState?.loading ?? false;
  const error = productsState?.error ?? null;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filtrar solo productos con descuento mayor a 0
  const productsWithDiscount = items.filter(
    (p) => p.descuento && p.descuento > 0 && (p.stock ?? 0) > 0
  );

  return (
    <div className="products-page-container">
      <div className="products-main-content">
        <h2 style={{ color: "#08471f", textAlign: "center", marginBottom: "2rem" }}>
          ¡Productos en Oferta!
        </h2>

        {loading && <p>Cargando ofertas...</p>}
        {error && <p style={{ color: "red" }}>Error al cargar: {error}</p>}

        {!loading && !error && productsWithDiscount.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
            No hay productos en oferta en este momento.
          </p>
        )}

        {!loading && !error && productsWithDiscount.length > 0 && (
          <ListCards productos={productsWithDiscount} />
        )}
      </div>
    </div>
  );
};

export default Offers;