import React, { useEffect, useState } from "react";
import ListCards from "../components/ListCards/ListCards";
import FeaturedCard from "../components/FCard/FCard";
import "../App.css";
import { productsService } from "../services/productsService";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
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

    cargarProductos();
  }, []);

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Producto principal: el primero de la lista
  const productoPrincipal = productos[0] || { name: "", description: "", precio: "" };
  // Productos destacados: el resto
  const productosDestacados = productos.slice(1);

  return (
    <div className="home">
      <div className="content">
        <h2>Equipa tu entrenamiento</h2>
        <FeaturedCard
          nombre={`${productoPrincipal.name}`}
          descripcion={`${productoPrincipal.description}`}
          precio={`$${productoPrincipal.price}`}
        />
      </div>

      <div className="content">
        <h2>Productos destacados</h2>
        <ListCards productos={productosDestacados} />
      </div>
    </div>
  );
}

