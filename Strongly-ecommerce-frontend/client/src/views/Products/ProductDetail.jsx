
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import { fetchProducts } from "../../redux/productsSlice";
import { addToCart } from "../../redux/CartSlice";  


import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    // Cargar productos solo si no están cargados
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleAddToCart = () => {
    const role = localStorage.getItem("role");

    if (role === "ADMIN") {
      toast.error("No podés tener un carrito siendo vendedor");
      return;
    }
    dispatch(addToCart({ productId: Number(id), quantity: 1 }))
      .unwrap()
      .then(() =>     Swal.fire('Éxito', '🛒 Producto agregado al carrito', 'success'))
      .catch(() =>
        //toast.error("⚠️ Debes iniciar sesión para agregar productos")
          console.error(err)

      );
  };
 //toast.success("🛒 Producto agregado al carrito"))
  if (loading) return <p className="loading">Cargando producto...</p>;
  if (error) return <p className="errorrrr">{error}</p>;
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

