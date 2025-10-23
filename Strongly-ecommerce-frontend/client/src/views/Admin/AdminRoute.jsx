import React from 'react';
import { Navigate } from 'react-router-dom';

// SIMULACIÓN: En una aplicación real, esto se obtendría del Contexto de Autenticación
const getCurrentUserRole = () => {
    // Valores de prueba:

    return localStorage.getItem("role"); 
};
 
const isAuthenticated = () => {
    // Verificar que el usuario esté logueado (necesario antes de verificar el rol)
    return getCurrentUserRole() !== null; 
};

// Componente que envuelve la ruta y verifica el rol
const AdminRoute = ({ element: Component, ...rest }) => {
    const userRole = getCurrentUserRole();
    
    if (!isAuthenticated()) {
        // 1. Si NO está autenticado, redirigir a Login/Registro
        return <Navigate to="/register" replace />; 
    }

    if (userRole === 'ADMIN') {
        // 2. Si está autenticado Y es ADMIN, renderizar el componente
        return <Component {...rest} />;
    } else {
        // 3. Si está autenticado pero NO es ADMIN (es USER), redirigir a Home
        return <Navigate to="/home" replace />; 
    }
};

export default AdminRoute;