import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, ShoppingCart } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Obtener cantidad de items del carrito desde Redux
  const cartItems = useSelector((state) => state.cart?.items ?? []);
  const cartCount = cartItems.length;

  // Obtener datos del usuario desde localStorage
  const userEmail = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logoutUser(); 
    navigate("/home");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

     
        <Link to="/home" className="navbar-logo-link">
          <h1 className="navbar-logo">STRONGLY</h1>
        </Link>

    
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>


        <ul className="navbar-menu">
          <li><Link to="/products">Productos</Link></li>
          <li><Link to="/offers">Ofertas</Link></li>

          {!user && <li><Link to="/register">Login</Link></li>}
          {role === "ADMIN" && <li><Link to="/admin">Administrar Productos</Link></li>}
          {role === "BUYER" && (
            <li>
              <Link to="/cart" className="cart-link-wrapper">
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </li>
          )}
          {user && (
            <li>
              <button className="logout-link" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
}
