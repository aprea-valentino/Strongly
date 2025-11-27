import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { productsService } from "../../services/productsService"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/CategoriesSlice";
import { updateProduct,createProduct } from "../../redux/productsSlice";

import './AddProduct.css';

const defaultFormData = {
  title: '',
  description: '',
  price: '',
  descuento: '',
  stock: '',
  categoryId: '', 
  imageFile: null
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const productIdToEdit = searchParams.get('edit');

  const dispatch = useDispatch();
const { items: categories } = useSelector((state) => state.categories);

useEffect(() => {

  dispatch(fetchCategories());


  const cargarProducto = async () => {
    if (!productIdToEdit) return;

    setLoading(true);
    try {
      const product = await productsService.getProductById(parseInt(productIdToEdit));
      if (!product) {
        console.error('Producto no encontrado');
        navigate('/admin');
        return;
      }

      setIsEditing(true);
      setFormData({
        title: product.name || product.title || "",
        description: product.description || "",
        price: product.price ? parseFloat(product.price) : "",
        descuento: product.descuento ? parseFloat(product.descuento) : "",
        stock: product.stock ? parseInt(product.stock) : "",
        categoryId: product.categoryid ? parseInt(product.categoryid) : (product.categoryId ? parseInt(product.categoryId) : ""),
        imageFile: null
      });

    } catch (err) {
      console.error('Error al cargar producto:', err);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  cargarProducto();
}, [productIdToEdit, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const productData = {
      name: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      descuento: formData.descuento ? parseFloat(formData.descuento) : 0, 
      stock: parseInt(formData.stock),
      id_category: parseInt(formData.categoryId),
      id_user: parseInt(localStorage.getItem("id")),
      is_active: true
    };

    let imageFiles = [];

    if (formData.imageFile) {
      if (formData.imageFile instanceof FileList) {
        imageFiles = Array.from(formData.imageFile);
      } else {
        imageFiles = [formData.imageFile];
      }
    }

    console.log({ productData, imageFiles })


    if (isEditing) {
 await dispatch(updateProduct({ id: parseInt(productIdToEdit), productData  })).unwrap();    
} else {
await dispatch(createProduct({ productData, imageFiles })).unwrap();

    }

    navigate("/admin/manage");
  } catch (err) {
    console.error("Error al guardar producto:", err);
    Swal.fire("Error", err.message, "error");
  } finally {
    setLoading(false);
  }
};




  if (loading) return <p>Cargando...</p>;

  return (
    <div className="add-product-container">
      <h1>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h1>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio ($):</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
        </div>

        {!isEditing && (
          <div className="form-group">
            <label htmlFor="descuento">Descuento (%):</label>
            <input    type="number"    id="descuento"    name="descuento"    value={formData.descuento || 0}    onChange={handleChange}    min="0"    max="100"    step="0.01"  />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} min="0" step="1" required />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Categoría:</label>
        
            <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            >
            <option value="">-- Seleccione una categoría --</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
            </select>

        </div>

        {!isEditing && (
  <div className="form-group">
    <label htmlFor="imageFile">Imagen:</label>
    <input
      type="file"      id="imageFile"      name="imageFile"      accept="image/*"      onChange={handleFileChange}      required
    />
  </div>
)}

        <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Guardar Producto'}</button>
      </form>
    </div>
  );
}