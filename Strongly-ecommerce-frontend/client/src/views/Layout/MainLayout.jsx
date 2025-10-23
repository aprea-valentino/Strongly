import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx'; 

export default function MainLayout() {
  return (
    <>
      <Navbar />
      {/* El <Outlet /> renderiza el componente de la ruta hija 
        (Home, Products, etc.) en este punto.
      */}
      <div className="content"> {/* Puedes envolverlo con tu clase CSS de contenido principal */}
        <Outlet /> 
      </div>
      <Footer />
    </>
  );
}