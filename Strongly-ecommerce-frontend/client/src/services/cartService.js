// src/services/cartService.js

const API_URL = "/cart"; // ✅ si usás proxy en vite.config.js

// 🔹 Obtener carrito del usuario logueado


export const getCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  const res = await fetch(`${API_URL}`, { // asegurate que la ruta sea correcta
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return await res.json();
};

// 🔹 Agregar un producto al carrito
export const addItemToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al agregar producto: ${text}`);
  }
  return await res.json();
};

// 🔹 Actualizar cantidad de un producto
export const updateCartItem = async (productId, quantity) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Error al actualizar cantidad");
  return await res.json();
};

// 🔹 Eliminar un producto del carrito
export const removeItemFromCart = async (productId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items?productId=${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar producto del carrito");
};

// 🔹 Vaciar carrito
export const clearCart = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/clear`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al vaciar carrito");
};

// 🔹 Finalizar compra (checkout)
export const checkout = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al realizar checkout");
  return await res.json();
};
