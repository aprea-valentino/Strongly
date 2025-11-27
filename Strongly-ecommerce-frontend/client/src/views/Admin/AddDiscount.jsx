import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchProductById, updateDiscount } from "../../redux/productsSlice";
import "./AddDiscount.css";

export default function AddDiscount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productId = searchParams.get("product");
  const action = searchParams.get("action");

  const { productosId: product, loading } = useSelector((state) => state.products);
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId))
        .unwrap()
        .then((data) => {
          if (data.descuento) {
            setDiscount(data.descuento);
          }
        })
        .catch((err) => {
          console.error("Error al cargar el producto:", err);
          Swal.fire("Error", "No se pudo cargar el producto", "error");
        });
    }
  }, [productId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const discountValue = parseFloat(discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      Swal.fire("Error", "El descuento debe ser un número entre 0 y 100", "error");
      return;
    }

    try {
      await dispatch(updateDiscount({ productId, discount: discountValue })).unwrap();
      
      Swal.fire({
        title: "Éxito",
        text: `Descuento ${action === "add" ? "agregado" : "modificado"} correctamente`,
        icon: "success"
      }).then(() => {
        navigate("/admin/sale");
      });
    } catch (err) {
      console.error("Error al actualizar el descuento:", err);
      Swal.fire("Error", "No se pudo actualizar el descuento", "error");
    }
  };

  if (loading) {
    return <div className="add-discount-container"><p>Cargando...</p></div>;
  }

  if (!product) {
    return <div className="add-discount-container"><p>Producto no encontrado</p></div>;
  }

  return (
    <div className="add-discount-container">
      <h1>{action === "add" ? "Agregar" : "Modificar"} Descuento</h1>
      
      <div className="product-info">
        <img src={product.image} alt={product.name} />
        <div>
          <h2>{product.name}</h2>
          <p>Precio: ${product.price}</p>
          {product.descuento > 0 && <p>Descuento actual: {product.descuento}%</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="discount-form">
        <div className="form-group">
          <label htmlFor="discount">Descuento (%)</label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">
            Guardar
          </button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate("/admin/sale")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
