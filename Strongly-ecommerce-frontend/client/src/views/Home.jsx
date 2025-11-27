import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productsSlice";
import ListCards from "../components/ListCards/ListCards";
import FeaturedCard from "../components/FCard/FCard";
import "../App.css";

export default function Home() {
  const dispatch = useDispatch();
  const { items: productos, loading: cargando, error } = useSelector((state) => state.products);

  useEffect(() => {

    if (productos.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productos.length]);

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

 
  const featuredId = localStorage.getItem('featuredProductId');
  let productoPrincipal;
  
  if (featuredId) {
    productoPrincipal = productos.find(p => p.id === parseInt(featuredId)) || productos[0];
  } else {
    productoPrincipal = productos[0];
  }
  
  productoPrincipal = productoPrincipal || { name: "", description: "", precio: "" };

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

