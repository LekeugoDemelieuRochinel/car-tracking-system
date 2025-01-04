import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

const AppRouter = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<ProtectedRoute element={<Login />} isProtected={false} />} />
                    <Route path="/register" element={<ProtectedRoute element={<Register />} isProtected={false} />} />
                    <Route path="/" element={<ProtectedRoute element={<Dashboard />} isProtected={true} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRouter;