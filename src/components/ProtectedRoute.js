import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // Redirect to login if not authenticated or role is incorrect
    if (!token || userRole !== requiredRole) {
        return <Navigate to="/login" replace />; // Redirect to /login, not /l
    }

    // Render the requested component if authenticated and role is correct
    return children;
};

export default ProtectedRoute;