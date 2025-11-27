import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AdminPage.css'; 
import NuevaCategory from './NuevaCategory';
import { useState } from 'react';

export default function AdminPage() {
    const navigate = useNavigate(); 

    const handleNavigation = (path) => {
        navigate(`/admin/${path}`);
    };
    

    const handleAction = (action) => {
        console.log(`Ejecutando acción: ${action}`);
    };

  const [showModal, setShowModal] = useState(false);

    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración de Productos</h1>
            <p>Bienvenido, Administrador. Desde aquí puedes gestionar el inventario.</p>
            
            <div className="admin-actions">



       
      <button 
        className="btn-categories"
        onClick={() => setShowModal(true)}
      >
        Agregar Nueva Categoría
      </button>

      {showModal && (
        <NuevaCategory onClose={() => setShowModal(false)} />
      )}

                <button 
                    className="btn-add"
                    onClick={() => navigate('/admin/add')}
                >
                    Agregar Nuevo Producto
                </button>
                <button 
                    className="btn-manage"
                    onClick={() => navigate('/admin/manage')}
                >
                    Modificar / Eliminar Productos
                </button>
                
            
                <button 
                    className="btn-discount"
                    onClick={() => navigate('/admin/sale')}
                >
                    Gestionar Descuentos
                </button>
                

            </div>
            
        </div>
    );
}