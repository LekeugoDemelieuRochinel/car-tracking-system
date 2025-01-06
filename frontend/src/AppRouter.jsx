// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GeofenceAlerts from './components/GeofenceAlerts';
import AddVehicle from './components/AddVehicle';
import AddGeofence from './components/AddGeofence';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import { AlertProvider } from './AlertContext';

const AppRouter = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <AuthProvider>
            <AlertProvider>
                <Router>
                    <div className="app-layout">
                        <Sidebar />
                        <div className="content">
                            <Routes>
                                <Route path="/login" element={<ProtectedRoute element={<Login />} isProtected={false} />} />
                                <Route path="/register" element={<ProtectedRoute element={<Register />} isProtected={false} />} />
                                <Route path="/" element={<ProtectedRoute element={<Dashboard />} isProtected={isAuthenticated} />} />
                                <Route path="/geofence-alerts" element={<GeofenceAlerts />} />
                                <Route path="/add-vehicle" element={<AddVehicle />} />
                                <Route path="/add-geofence" element={<AddGeofence />} />
                            </Routes>
                        </div>
                    </div>
                </Router>
            </AlertProvider>
        </AuthProvider>
    );
};

export default AppRouter;
