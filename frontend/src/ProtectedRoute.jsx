import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, isProtected }) => {
    const { isAuthenticated } = useAuth();

    // If the route is protected and the user is not authenticated, redirect to login
    if (isProtected && !isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If the route is not protected and the user is authenticated, redirect to dashboard
    if (!isProtected && isAuthenticated) {
        return <Navigate to="/" />;
    }

    return element;
};

export default ProtectedRoute;