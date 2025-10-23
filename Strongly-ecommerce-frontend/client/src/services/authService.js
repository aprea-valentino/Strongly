// src/services/authService.js

const API_URL = "/api/v1/auth"; // ✅ usa el proxy definido en vite.config.js
import jwt_decode from "jwt-decode";

export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),

    });
//console.log("res:", res);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
   // console.log("DATA RECIBIDA DEL LOGIN:", data);

    localStorage.setItem("token", data.access_token); // guarda token JWT

const decoded = jwt_decode(data.access_token);

localStorage.setItem("role", decoded.rol);
localStorage.setItem("id", decoded.id);
console.log( localStorage.getItem("role")); // "ADMIN" o "BUYER"
console.log( localStorage.getItem("id")); // "ADMIN" o "BUYER"

      console.log("local storage:",  localStorage.getItem("token"));

    return data;
  } catch (err) {
    console.error("Error en login:", err);
    throw err;
  }
};

export const register = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error en register:", err);
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
};
