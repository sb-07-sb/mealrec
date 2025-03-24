import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, formSubmittedRedirect }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const formSubmitted = localStorage.getItem('formSubmitted');

    // Redirect to login if not authenticated or role is incorrect
    if (!token || userRole !== requiredRole) {
        return <Navigate to="/login" replace />; // Redirect to /login, not /l
    }
    // If the form has been submitted, redirect to the specified page
    if (formSubmittedRedirect && formSubmitted === 'true') {
        return <Navigate to={formSubmittedRedirect} replace />;
    }

    // Render the requested component if authenticated and role is correct
    return children;
};

export default ProtectedRoute;