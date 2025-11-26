import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser, registerUser } from "../../redux/authSlice";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Traemos estado global de Redux
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        console.log("🔐 LOGIN OK");
        navigate("/home");
      })
      .catch(() => {
        console.error("❌ Error en login");
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const userData = {
      firstname,
      lastname,
      email,
      password,
      role: "BUYER",
    };

    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        console.log("📝 REGISTRO OK");
        navigate("/home");
      })
      .catch(() => {
        console.error("❌ Error en registro");
      });
  };

  return (
    <div className="register-page-container">
      <div className="forms-wrapper">

        {/* FORMULARIO DE REGISTRO */}
        <div className="form-box register-form-box">
          <h2>Registro</h2>
          <form onSubmit={handleRegister}>
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
          <form onSubmit={handleLogin}>
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
