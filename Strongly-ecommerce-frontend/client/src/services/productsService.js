// src/services/productsService.js
const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";
const API_URL = `${API_BASE}/product`;

export const productsService = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  createProductWithImages,
  updatePrice,
  updateStock,
  updateProduct,
  updatePriceStock,
};

// Obtener todos los productos
async function getAllProducts(searchQuery) {
  try {
    let url = `${API_URL}`;
    if (searchQuery) {
      url += `?q=${encodeURIComponent(searchQuery)}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}`);
  

    return await res.json();
  } catch (err) {
    console.error("Error al obtener todos los productos:", err);
    throw err;
  }
}

// Obtener productos por categoría
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

// Obtener producto por ID
async function getProductById(productId) {
  try {
    const res = await fetch(`${API_URL}/${productId}`);
    if (res.status === 204) return null;
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error al obtener producto por ID:", err);
    throw err;
  }
}
async function createProduct(payload, files) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token");

  const formData = new FormData();

  formData.append(
    "product",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );

  if (files && files.length > 0) {
    for (const file of files) {
      formData.append("images", file);
    }
  }

  const res = await fetch(`${API_URL}/multipart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // NO agregar Content-Type para multipart
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}


/*
// Crear producto
async function createProduct(productData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  try {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
*/
// Crear producto con imágenes (multipart)
async function createProductWithImages(formData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  try {
    const res = await fetch(`${API_URL}/multipart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return await res.json();
  } catch (err) {
    console.error("Error al crear producto con imágenes:", err);
    throw err;
  }
}

// Actualizar precio
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

// Actualizar stock
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

// Actualizar producto completo
async function updateProduct(productId, productData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  try {
    const res = await fetch(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return await res.json();
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    throw err;
  }
}

// Actualizar precio y stock a través del endpoint /updateProduct (backend espera {idProducto, precio, stock})
async function updatePriceStock(idProducto, precio, stock, name, id_category, descuento) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token, el usuario no inició sesión");

  try {
    const payload = { idProducto, precio, stock ,descuento};
    if (name !== undefined) payload.name = name;
    if (id_category !== undefined) payload.id_category = id_category;

    const res = await fetch(`${API_URL}/updateProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return await res.json();
  } catch (err) {
    console.error("Error al actualizar precio/stock:", err);
    throw err;
  }
}