const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';
const API_URL = `${API_BASE}/cart`;



export const getCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  const res = await fetch(`${API_URL}`, { 
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
  console.log( {   method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),}
  )
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al agregar producto: ${text}`);
  }
  return await res.json();
};

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



export const removeItemFromCart = async (productId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/items?productId=${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar producto del carrito");
};



export const clearCart = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/clear`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al vaciar carrito");
};



export const checkout = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al realizar checkout");
  return await res.json();
};
