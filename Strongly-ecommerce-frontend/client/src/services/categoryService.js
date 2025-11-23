// src/services/categoryService.js

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const API_URL = `${API_BASE}/categories`;

export const categoryService = {
  // 🔹 Traer todas las categorías
  getAllCategories: async () => {
    try {
      const res = await fetch(`${API_URL}`);
      if (!res.ok) throw new Error("Error al obtener categorías");
      return await res.json();
    } catch (err) {
      console.error("categoryService.getAllCategories:", err);
      throw err;
    }
  },

  // 🔹 Traer categoría por ID
  getCategoryById: async (categoryId) => {
    try {
      const res = await fetch(`${API_URL}/${categoryId}`);
      if (res.status === 204) return null; // no content
      if (!res.ok) throw new Error("Error al obtener categoría");
      return await res.json();
    } catch (err) {
      console.error(`categoryService.getCategoryById(${categoryId}):`, err);
      throw err;
    }
  },

  // 🔹 Traer categorías por parentId
  getCategoriesByParent: async (parentId) => {
    try {
      const res = await fetch(`${API_URL}/by-parent/${parentId}`);
      if (res.status === 204) return []; // no content
      if (!res.ok) throw new Error("Error al obtener categorías por parent");
      return await res.json();
    } catch (err) {
      console.error(`categoryService.getCategoriesByParent(${parentId}):`, err);
      throw err;
    }
  },

  // 🔹 Crear categoría
  createCategory: async (categoryData) => {

    
        const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  try {

    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
       },
      body: JSON.stringify(categoryData),
      
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    return await res.json();
  } catch (err) {
      console.error("categoryService.createCategory:", err);
    throw err;
  }

 
  },
};
