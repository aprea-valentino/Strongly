
const API_URL = "/product";
// src/services/productsService.js


export const productsService = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updatePrice,
  updateStock
};

/**
 * Obtener todos los productos
 * @returns {Promise<Array>}
 */
async function getAllProducts() {
  try {
    const res = await fetch(`${API_URL}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error al obtener todos los productos:", err);
    throw err;
  }
}

/**
 * Obtener productos por categoría
 * @param {number} categoryId 
 * @returns {Promise<Array>}
 */
async function getProductsByCategory(categoryId) {
  try {
    const res = await fetch(`${API_URL}/category/${categoryId}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error al obtener productos por categoría:", err);
    throw err;
  }
}

/**
 * Obtener producto por ID
 * @param {number} productId 
 * @returns {Promise<Object|null>}
 */
async function getProductById(productId) {
  try {
    const res = await fetch(`${API_URL}/${productId}`);
    if (res.status === 204) return null; // No content
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error al obtener producto por ID:", err);
    throw err;
  }
}

/**
 * Crear un nuevo producto
 * @param {Object} productData 
 * @returns {Promise<Object>}
 */
async function createProduct(productData) {
    const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  try {

    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
       },
      body: JSON.stringify(productData),
      
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    return await res.json();
  } catch (err) {
    console.error("Error al crear producto:", err);
    throw err;
  }
}

/**
 * Actualizar precio de un producto
 * @param {number} idProducto 
 * @param {number} precio 
 * @returns {Promise<Object>}
 */
async function updatePrice(idProducto, precio) {
  try {
    const res = await fetch(`${API_URL}/updatePrice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idProducto, precio }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error al actualizar precio:", err);
    throw err;
  }
}

/**
 * Actualizar stock de un producto
 * @param {number} idProducto 
 * @param {number} stock 
 * @returns {Promise<Object>}
 */
async function updateStock(idProducto, stock) {
  try {
    const res = await fetch(`${API_URL}/updateStock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idProducto, stock }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error al actualizar stock:", err);
    throw err;
  }
}
