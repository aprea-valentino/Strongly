import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './manage.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../redux/productsSlice";
import { fetchCategories } from "../../redux/CategoriesSlice";

export default function Manage() {
  const [featuredProductId, setFeaturedProductId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items: products, loading: cargando, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);


  useEffect(() => {
    const savedFeaturedId = localStorage.getItem('featuredProductId');
    if (savedFeaturedId) {
      setFeaturedProductId(parseInt(savedFeaturedId));
    }
  }, []);


  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);


  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto "${name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonColor: '#08471f'
        });
      } catch (err) {
        console.error(err);
        const errorMessage = err || 'No se pudo eliminar el producto.';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#08471f'
        });
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/add?edit=${id}`);
  };

  const handleSetFeatured = (id) => {
    localStorage.setItem('featuredProductId', id.toString());
    setFeaturedProductId(id);
    Swal.fire({
      title: '¡Producto destacado!',
      text: `El producto ahora se mostrará en la tarjeta principal de la Home.`,
      icon: 'success',
      confirmButtonColor: '#08471f'
    });
  };

  return (
    <div className="manage-products-container">
      <h1>Gestión de Inventario</h1>

      {cargando && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && (
        <>
          <p className="inventory-info">
            Total de productos en el sistema: {products.length}
          </p>

          {products.length === 0 ? (
            <p className="no-products">No hay productos cargados.</p>
          ) : (
            <div className="product-list-wrapper">
              {products.map((product) => (
                <div key={product.id} className="manage-product-item">
                  <div className="product-details">
                    <span className="product-name">{product.name}</span>
                    <span className="product-category">
                      Categoría: {categories.find(c => c.id === product.categoryid)?.name || 'Sin categoría'}
                    </span>
                    <span className="product-stock">Stock: {product.stock}</span>
                  </div>

                  <div className="product-pricing">
                    <span className="product-price">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product.id)}
                    >
                      Editar producto
                    </button>
                    <button
                      className="btn-featured"
                      onClick={() => handleSetFeatured(product.id)}
                      title="Marcar como producto destacado en la Home"
                    >
                      ⭐ Inicio
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
