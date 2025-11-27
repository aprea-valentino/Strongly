import React from 'react';
import { Navigate } from 'react-router-dom';


const getCurrentUserRole = () => {

    return localStorage.getItem("role"); 
};
 
const isAuthenticated = () => {
    return getCurrentUserRole() !== null; 
};

const AdminRoute = ({ element: Component, ...rest }) => {
    const userRole = getCurrentUserRole();
    
    if (!isAuthenticated()) {
        return <Navigate to="/register" replace />; 
    }

    if (userRole === 'ADMIN') {
        return <Component {...rest} />;
    } else {
        return <Navigate to="/home" replace />; 
    }
};

export default AdminRoute;