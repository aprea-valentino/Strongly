import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx'; 

export default function MainLayout() {
  return (
    <>
      <Navbar />

      <div className="content"> 
        <Outlet /> 
      </div>
      <Footer />
    </>
  );
}