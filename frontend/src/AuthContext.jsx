import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for token on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // User is authenticated if token exists
        }
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useAuth = () => {
    return useContext(AuthContext);
};