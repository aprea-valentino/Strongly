
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
const imageSrc = product.image
  ? `data:${product.contentType};base64,${product.image}`
  : null;

  return (
    <div className="product-detail-container">
      <div className="product-detail-wrapper">
        {/* Columna Izquierda - Imagen */}
        <div className="product-image-section">
          {product.image ? (
            <img
              src={`data:${product.contentType};base64,${product.image}`}
              alt={product.name}
              className="product-image"
            />
          ) : (
            <div className="no-image">Sin imagen</div>
          )}
        </div>

        {/* Columna Derecha - Información */}
        <div className="product-info-section">
          <div className="product-category">
            <span className="category-badge">Producto Premium</span>
          </div>
          
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-price-section">
            {product.descuento > 0 ? (
              <>
                <div className="price-container">
                  <span className="product-price-original">${product.price}</span>
                  <span className="product-price">${(product.price - (product.price * product.descuento / 100)).toFixed(2)}</span>
                </div>
                <span className="discount-badge">-{product.descuento}% OFF</span>
              </>
            ) : (
              <span className="product-price">${product.price}</span>
            )}
          </div>

          <div className="product-stock">
            <span className="stock-icon">✅</span>
            <span className="stock-text">
              {product.stock > 0 
                ? `${product.stock} unidades disponibles` 
                : 'Sin stock'}
            </span>
          </div>

          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>

          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <span className="btn-icon">🛍️</span>
            Agregar al carrito
          </button>

          <div className="product-benefits">
            <div className="benefit-item">
              <span>🚚</span>
              <span>Envío gratis</span>
            </div>
            <div className="benefit-item">
              <span>🔒</span>
              <span>Compra segura</span>
            </div>
            <div className="benefit-item">
              <span>↩️</span>
              <span>Devolución gratis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

