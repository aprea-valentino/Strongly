import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import "./PaginaDescuentos.css";
import { useNavigate } from "react-router-dom";
import { productsService } from "../../services/productsService";

export default function PaginaDescuentos() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 🔹 Cargar productos reales desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Función para manejar las acciones del descuento
  const handleDiscountAction = (action, id, name) => {
    console.log(`Acción: ${action} en Producto: ${name} (ID: ${id})`);

    if (action === "add" || action === "modify") {
      // Podrías redirigir a una página de edición o abrir un modal
      navigate(`/admin/discount?product=${id}&action=${action}`);
    } else if (action === "delete") {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Seguro que quieres eliminar el descuento de ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Eliminado', `Descuento de ${name} eliminado (simulación).`, 'success');
        }
      });
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
                      product.discount && product.discount > 0
                        ? "discount-active"
                        : "discount-inactive"
                    }
                  >
                    {product.discount || 0}%
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
                  disabled={!product.discount || product.discount === 0}
                >
                  Modificar
                </button>
                <button
                  className="btn-delete-discount"
                  onClick={() =>
                    handleDiscountAction("delete", product.id, product.name)
                  }
                  disabled={!product.discount || product.discount === 0}
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


/* import React, { useState } from 'react';
import './PaginaDescuentos.css';
import { useNavigate } from 'react-router-dom';

// SIMULACIÓN: Lista de productos con descuentos de ejemplo
const initialProducts = [
    { id: 1, nombre: 'Mancuernas 10kg', precio: 50.00, descuento: 0, categoria: 'Pesas' },
    { id: 2, nombre: 'Banda Elástica', precio: 15.50, descuento: 10, categoria: 'Accesorios' }, // 10% de descuento
    { id: 3, nombre: 'Barra Dominadas', precio: 75.00, descuento: 0, categoria: 'Máquinas' },
];

export default function PaginaDescuentos() {
    const [products, setProducts] = useState(initialProducts);
    const navigate = useNavigate();

    // Función para manejar las acciones del descuento (simulación)
    const handleDiscountAction = (action, id, name) => {
        // Aquí iría la lógica para abrir un modal o redirigir a un formulario
        console.log(`Acción: ${action} en Producto: ${name} (ID: ${id})`);
        
        // Simulación de redirección para agregar/modificar
        if (action === 'add' || action === 'modify') {
            alert(`Simulación: Redirigiendo a formulario para ${action} descuento en ${name}.`);
        } else if (action === 'delete') {
            if (window.confirm(`¿Seguro que quieres eliminar el descuento de ${name}?`)) {
                 // Lógica para eliminar el descuento (setProducts en una app real)
                alert(`Descuento de ${name} eliminado (simulación).`);
            }
        }
    };

    return (
        <div className="manage-discounts-container">
            <h1>Gestión de Descuentos</h1>
            <p className="inventory-info">Aplica, modifica o elimina descuentos en tus productos.</p>

            <div className="product-list-wrapper">
                {products.map((product) => (
                    <div key={product.id} className="discount-product-item">
                        
                        <div className="discount-product-details">
                            <span className="product-name">{product.nombre}</span>
                            <span className="product-price">${product.precio.toFixed(2)}</span>
                            
                            <span className="current-discount">
                                Descuento Actual: 
                                <span className={product.descuento > 0 ? 'discount-active' : 'discount-inactive'}>
                                    {product.descuento}%
                                </span>
                            </span>
                        </div>

                        <div className="discount-actions">
                            <button 
                                className="btn-add-discount"
                                onClick={() => handleDiscountAction('add', product.id, product.nombre)}
                            >
                                Agregar
                            </button>
                            <button 
                                className="btn-modify-discount"
                                onClick={() => handleDiscountAction('modify', product.id, product.nombre)}
                                disabled={product.descuento === 0}
                            >
                                Modificar
                            </button>
                            <button 
                                className="btn-delete-discount"
                                onClick={() => handleDiscountAction('delete', product.id, product.nombre)}
                                disabled={product.descuento === 0}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} */