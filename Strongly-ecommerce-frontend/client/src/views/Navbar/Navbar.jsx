import "./Navbar.css";
import React, { useState, useContext } from 'react'; // Importa useState
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa'; // Importa el ícono de búsqueda
import { AuthContext } from '../../context/AuthContext';
import { logout as serviceLogout } from '../../services/authService';

export default function Navbar() {
  // Estado para el texto que el usuario escribe en la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Aquí iría la lógica real de búsqueda/filtrado:
    // 1. Redireccionar a la página de resultados: navigate(`/search?q=${searchTerm}`);
    // 2. Llamar a una función de contexto para filtrar productos.
    
    console.log("Buscando producto:", searchTerm);
    setSearchTerm(''); //Al buscar, queda el campo libre
    
  };
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // role stored in localStorage by the login flow
    const role = localStorage.getItem("role"); // "ADMIN" o "BUYER"

    const handleLogout = () => {
      // Clear via service (in case other parts rely on it) and update context
      serviceLogout();
      if (logoutUser) logoutUser();
      // Redirect to home after logout
      navigate('/home');
    };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Nombre del sitio / Logo */}
        <Link to="/home" className="navbar-logo-link">
          <h1 className="navbar-logo">STRONGLY</h1>
        </Link>
        
        {/* Barra de búsqueda */}
        <form className="search-bar" onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                // Actualiza el estado con lo que el usuario escribe
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
                <FaSearch />
            </button>
        </form>

        {/* Menú */}
        <ul className="navbar-menu">
          <li><Link to="/products">Productos</Link></li>
          <li><Link to="/offers">Ofertas</Link></li>
          
          {!role && <li><Link to="/register">Login</Link></li>}
        {role === "ADMIN" && <li><Link to="/admin">Administrar Productos</Link></li>}
           {role === "BUYER" && <li><Link to="/cart"><FaShoppingCart /></Link></li>}
          {/* Si hay usuario logueado mostramos botón para cerrar sesión */}
          {user && (
            <li>
              {/* Enlace que actúa como logout: evita navegación por defecto y llama al handler */}
              <a href="#" className="logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                Cerrar sesión
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}