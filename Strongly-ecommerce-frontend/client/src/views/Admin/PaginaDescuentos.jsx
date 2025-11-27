import React, { useEffect } from "react";
import Swal from 'sweetalert2';
import "./PaginaDescuentos.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateDiscount } from "../../redux/productsSlice";

export default function PaginaDescuentos() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);


  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  const handleDiscountAction = async (action, id, name) => {
    console.log(`Acción: ${action} en Producto: ${name} (ID: ${id})`);

    if (action === "add" || action === "modify") {
      navigate(`/admin/discount?product=${id}&action=${action}`);
    } else if (action === "delete") {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Seguro que quieres eliminar el descuento de ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          await dispatch(updateDiscount({ productId: id, discount: 0 })).unwrap();
          
          Swal.fire('Eliminado', `Descuento de ${name} eliminado correctamente.`, 'success');
        } catch (err) {
          console.error("Error al eliminar descuento:", err);
          Swal.fire('Error', 'No se pudo eliminar el descuento', 'error');
        }
      }
    }
  };

  return (
    <div className="manage-discounts-container">
      <h1>Gestión de Descuentos</h1>
      <p className="inventory-info">
        Aplica, modifica o elimina descuentos en tus productos.
      </p>

      {products.length === 0 ? (
        <p className="no-products">No hay productos cargados.</p>
      ) : (
        <div className="product-list-wrapper">
          {products.map((product) => (
            <div key={product.id} className="discount-product-item">
              <div className="discount-product-details">
                <span className="product-name">{product.name}</span>
                <span className="product-price">${product.price}</span>

                <span className="current-discount">
                  Descuento Actual:{" "}
                  <span
                    className={
                      product.descuento && product.descuento > 0
                        ? "discount-active"
                        : "discount-inactive"
                    }
                  >
                    {product.descuento || 0}%
                  </span>
                </span>
              </div>

              <div className="discount-actions">
                <button
                  className="btn-add-discount"
                  onClick={() =>
                    handleDiscountAction("add", product.id, product.name)
                  }
                >
                  Agregar
                </button>
                <button
                  className="btn-modify-discount"
                  onClick={() =>
                    handleDiscountAction("modify", product.id, product.name)
                  }
                  disabled={!product.descuento || product.descuento === 0}
                >
                  Modificar
                </button>
                <button
                  className="btn-delete-discount"
                  onClick={() =>
                    handleDiscountAction("delete", product.id, product.name)
                  }
                  disabled={!product.descuento || product.descuento === 0}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

