import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './AdminPage.css'; // Crea un CSS simple para esta vista

export default function AdminPage() {
    const navigate = useNavigate(); // Inicializar el hook

    const handleNavigation = (path) => {
        // Navega a la ruta hija: /admin/add
        navigate(`/admin/${path}`);
    };
    
    // Función de ejemplo para las otras acciones
    const handleAction = (action) => {
        console.log(`Ejecutando acción: ${action}`);
    };

    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración de Productos</h1>
            <p>Bienvenido, Administrador. Desde aquí puedes gestionar el inventario.</p>
            
            <div className="admin-actions">
                <button 
                    className="btn-add"
                    onClick={() => navigate('/admin/add')}// Redirige a /admin/AddProduct
                >
                    Agregar Nuevo Producto
                </button>
                <button 
                    className="btn-manage"
                    onClick={() => navigate('/admin/manage')}
                >
                    Modificar / Eliminar Productos
                </button>
                
                {/* NUEVO BOTÓN: Gestionar Descuentos */}
                <button 
                    className="btn-discount"
                    onClick={() => navigate('/admin/sale')}
                >
                    Gestionar Descuentos
                </button>
                
                {/* Aquí iría un componente para listar y editar productos */}
                {/* <ProductListForAdmin /> */}
            </div>
            
            {/* El Outlet se usaría aquí si quisiéramos renderizar rutas hijas DENTRO de este componente. 
                Por ahora, usamos la navegación simple. 
            */}
        </div>
    );
}