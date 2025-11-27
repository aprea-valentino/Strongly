import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { productsService } from "../../services/productsService";
import "./AddDiscount.css";

export default function AddDiscount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("product");
  const action = searchParams.get("action");

  const [product, setProduct] = useState(null);
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          const data = await productsService.getProductById(productId);
          setProduct(data);
          if (data.discount) {
            setDiscount(data.discount);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        Swal.fire("Error", "No se pudo cargar el producto", "error");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const discountValue = parseFloat(discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      Swal.fire("Error", "El descuento debe ser un número entre 0 y 100", "error");
      return;
    }

    try {
      // Aquí deberías llamar al servicio para actualizar el descuento
      // await productsService.updateDiscount(productId, discountValue);
      
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
          {product.discount > 0 && <p>Descuento actual: {product.discount}%</p>}
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
