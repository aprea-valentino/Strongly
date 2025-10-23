import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productsService } from "../../services/productsService"; 
import { categoryService } from '../../services/categoryService';

import './AddProduct.css';

const defaultFormData = {
  title: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '', // solo el id
  imageFile: null
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(defaultFormData);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const productIdToEdit = searchParams.get('edit');

  
/* useEffect(() => {
  const cargarCategorias = async () => {
    try {
      const cats = await categoryService.getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };
  cargarCategorias();
}, []); */

  useEffect(() => {
    // 🔹 Cargar categorías
    const cargarCategorias = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    cargarCategorias();

    // 🔹 Si es edición, cargar datos del producto
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
            name: product.title,
  description: product.description,
  price: parseFloat(product.price),
  stock: parseInt(product.stock),
  id_category: parseInt(product.categoryId),
  id_user:   parseInt(product.getItem("id")),        // 🔹 reemplazar con el ID real del usuario logueado
  is_active: true    // opcional, si querés crear el producto activo por defecto
        
        });
      } catch (err) {
        console.error('Error al cargar producto:', err);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [productIdToEdit, navigate]);

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

      const payload = {
  name: formData.title,
  description: formData.description,
  price: parseFloat(formData.price),
  stock: parseInt(formData.stock),
  id_category: parseInt(formData.categoryId),
  id_user:   parseInt(localStorage.getItem("id")),        // 🔹 reemplazar con el ID real del usuario logueado
  is_active: true    // opcional, si querés crear el producto activo por defecto
};

      console.log(payload)

      if (isEditing) {
        await productsService.updatePrice(productIdToEdit, payload.price);
        await productsService.updateStock(productIdToEdit, payload.stock);
        console.log('Producto editado correctamente');
      } else {
        await productsService.createProduct(payload);
        console.log('Producto creado correctamente');
      }

      navigate('/admin/manage');
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert(err.message);
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

        <div className="form-group">
          <label htmlFor="imageFile">Imagen {isEditing && '(Opcional si no cambia)'}:</label>
          <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleFileChange} required={!isEditing} />
        </div>

        <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Guardar Producto'}</button>
      </form>
    </div>
  );
}
/* import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AddProduct.css';
import { productsService } from "../../services/productsService"; 

const defaultFormData = {
    title: '',
    description: '',
    price: '',
    stock: '',
    imageFile: null,
};

export default function AddProduct() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [formData, setFormData] = useState(defaultFormData);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const productIdToEdit = searchParams.get('edit');

    // 1. EFECTO PARA CARGAR DATOS EN MODO EDICIÓN
    useEffect(() => {
        const cargarProducto = async () => {
            if (!productIdToEdit) {
                setIsEditing(false);
                setFormData(defaultFormData);
                return;
            }

            setLoading(true);
            try {
                const id = parseInt(productIdToEdit);
                const product = await productsService.getProductById(id);

                if (!product) {
                    console.error(`Producto con ID ${id} no encontrado.`);
                    navigate('/admin');
                    return;
                }

                setIsEditing(true);
                setFormData({
                    title: product.name,
                    description: product.description,
                    price: product.price.toString(),
                    stock: product.stock.toString(),
                    imageFile: null,
                });
            } catch (err) {
                console.error("Error al cargar producto:", err);
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };

        cargarProducto();
    }, [productIdToEdit, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing) {
                await productsService.updatePrice(productIdToEdit, parseFloat(formData.price));
                await productsService.updateStock(productIdToEdit, parseInt(formData.stock));
                console.log("Producto editado exitosamente.");
            } else {
                await productsService.createProduct({
                    name: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    id_category: 1, // 🔹 ajustar según tu lógica
                    id_User: 1      // 🔹 ajustar según tu usuario
                });
                console.log("Producto agregado exitosamente.");
            }

            navigate('/admin/manage');
        } catch (err) {
            console.error("Error al guardar producto:", err);
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
                    <label htmlFor="title">Título del Producto:</label>
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descripción:</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Precio ($):</label>
                    <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleChange} 
                        min="0"
                        step="0.01"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stock">Cantidad en Stock:</label>
                    <input 
                        type="number" 
                        id="stock" 
                        name="stock" 
                        value={formData.stock} 
                        onChange={handleChange} 
                        min="0"
                        step="1"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="imageFile">Imagen {isEditing && "(Opcional si no cambia)"}:</label>
                    <input 
                        type="file" 
                        id="imageFile" 
                        name="imageFile" 
                        accept="image/*"
                        onChange={handleFileChange} 
                        required={!isEditing}
                    />
                </div>
                
                <button type="submit" className="btn-submit">
                    {isEditing ? 'Guardar Cambios' : 'Guardar Producto'}
                </button>
            </form>
        </div>
    );
}

 */