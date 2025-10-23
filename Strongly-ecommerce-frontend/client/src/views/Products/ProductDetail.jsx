import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addItemToCart } from "../../services/cartService";
import "./ProductDetail.css"; // 👈 asegurate de tener este CSS

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/product/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

const handleAddToCart = async () => {
  const role = localStorage.getItem("role");

  if (role === "ADMIN") {
    alert("No podes tener un carrito siendo vendedor");
    return; // salimos de la función
  }

  try {
    await addItemToCart(product.id, 1);
    alert("🛒 Producto agregado al carrito");
  } catch (err) {
    alert("⚠️ Debes iniciar sesión para agregar productos");
    console.error(err);
  }
};


  if (loading) return <p className="loading">Cargando producto...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="empty">No se encontró el producto.</p>;

  return (
    <div className="product-detail-container">
      <div className="product-card">
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>
          <h3>${product.price}</h3>
          <p className="stock">Stock disponible: {product.stock}</p>
          <button className="add-btn" onClick={handleAddToCart}>
            Agregar al carrito 🛒
          </button>
        </div>
      </div>
    </div>
  );
}