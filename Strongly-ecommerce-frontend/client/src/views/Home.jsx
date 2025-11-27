import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListCards from "../components/ListCards/ListCards";
import FeaturedCard from "../components/FCard/FCard";
import "../App.css";
import { productsService } from "../services/productsService";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      setCargando(true);
      setError(null);
      productsService.getAllProducts()
        .then(data => {
          setProductos(data);
          setError(null); // Asegurar que se limpia cualquier error anterior
        })

        .catch(err => {
                console.error("Error al cargar productos:", err);
                setError("No se pudieron cargar los productos");
              })

        .finally(() => {
          setCargando(false);
        });

      
    }, []);

    
  

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Producto principal: buscar el destacado o usar el primero
  const featuredId = localStorage.getItem('featuredProductId');
  let productoPrincipal;
  
  if (featuredId) {
    productoPrincipal = productos.find(p => p.id === parseInt(featuredId)) || productos[0];
  } else {
    productoPrincipal = productos[0];
  }
  
  productoPrincipal = productoPrincipal || { name: "", description: "", precio: "" };
  // Productos destacados: el resto
  const productosDestacados = productos.slice(1);
const precio = productoPrincipal.price;
const descuento =productoPrincipal.descuento;
  return (
    <div className="home">
      <div className="content">
        <h2>Equipa tu entrenamiento</h2>
        <Link 
          to={`/product/${productoPrincipal.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <FeaturedCard
            nombre={`${productoPrincipal.name}`}
            descripcion={`${productoPrincipal.description}`}
            precioOriginal={precio}
            precioConDescuento={
            descuento && descuento > 0
              ? precio - (precio * descuento) / 100
              : precio
          }
            imagen={`${productoPrincipal.image}`}
          />
        </Link>
      </div>

      <div className="content">
        <h2>Productos destacados</h2>
        <ListCards productos={productosDestacados} />
      </div>
    </div>
  );
}

