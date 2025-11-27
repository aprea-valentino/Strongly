const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";
const API_URL = `${API_BASE}/users`;

export const userService = {
  getUserById: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token, el usuario no inició sesión");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) return null;
      if (!res.ok) throw new Error("Error al obtener usuario");

      return await res.json();
    } catch (err) {
      console.error(`userService.getUserById(${id}):`, err);
      throw err;
    }
  },




  getAllUsers: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token, el usuario no inició sesión");

    try {
      const res = await fetch(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) return [];
      if (!res.ok) throw new Error("Error al obtener usuarios");

      return await res.json();
    } catch (err) {
      console.error("userService.getAllUsers:", err);
      throw err;
    }
  },




  createUser: async (userData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token, el usuario no inició sesión");

    try {
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      return await res.json();
    } catch (err) {
      console.error("userService.createUser:", err);
      throw err;
    }
  },




  
  deleteUser: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token, el usuario no inició sesión");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      return true;
    } catch (err) {
      console.error(`userService.deleteUser(${id}):`, err);
      throw err;
    }
  },
};
