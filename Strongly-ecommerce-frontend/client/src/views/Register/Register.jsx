import React, { useState, useContext } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  // 🔹 Función unificada para login / register
  const handleSubmit = async (e, isLoginAction) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLoginAction) {
        // 🔐 LOGIN
        const data = await login(email, password);
        loginUser(data);
        console.log("✅ LOGIN EXITOSO:", data);
        navigate("/home");


      } else {
        // 📝 REGISTER
        if (!firstname || !lastname || !email || !password)
          return setError("Por favor, completa todos los campos.");

        const userData = {
          firstname,
          lastname,
          email,
          password,
          role: "BUYER", // Valor por defecto, coincide con tu enum Role
        };

        const data = await register(userData);
        console.log("✅ REGISTRO EXITOSO:", data);

        // Si el backend devuelve token, guardarlo automáticamente
        if (data.token) loginUser(data);

        navigate("/home");
      }
    } catch (err) {
      console.error("❌ Error en autenticación:", err);
      setError("Error al autenticar. Verifica los datos o el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="forms-wrapper">
        {/* FORMULARIO DE REGISTRO */}
        <div className="form-box register-form-box">
          <h2>Registro</h2>
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nombre"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Apellido"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" className="btn btn-register-action" disabled={loading}>
              {loading ? "Registrando..." : "Aceptar"}
            </button>
          </form>
        </div>

        {/* FORMULARIO DE LOGIN */}
        <div className="form-box login-form-box">
          <h2>Login</h2>
          <form onSubmit={(e) => handleSubmit(e, true)}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p className="forgot-password">
              ¿Olvidaste tu contraseña? <a href="#">click aquí</a>
            </p>
            <button type="submit" className="btn btn-login-action" disabled={loading}>
              {loading ? "Ingresando..." : "Aceptar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
