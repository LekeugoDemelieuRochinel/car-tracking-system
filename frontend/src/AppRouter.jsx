import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GeofenceAlerts from './components/GeofenceAlerts';
import AddVehicle from './components/AddVehicle';
import AddGeofence from './components/AddGeofence';
import DriverPage from './components/DriverPage';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import { AlertProvider } from './AlertContext';
import AgencyProfilePage from './components/AgencyProfilePage';

// Component to check if Sidebar should be shown or not
const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="app-layout">
            {/* Only render Sidebar if not on login or register page */}
            {!isAuthPage && <Sidebar />}
            <div className={`content ${isAuthPage ? 'full-width' : ''}`}>{children}</div>
        </div>
    );
};

const AppRouter = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <AuthProvider>
            <AlertProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<ProtectedRoute element={<Login />} isProtected={false} />} />
                        <Route path="/register" element={<ProtectedRoute element={<Register />} isProtected={false} />} />
                        <Route
                            path="/"
                            element={
                                <Layout>
                                    <ProtectedRoute element={<Dashboard />} isProtected={true} />
                                </Layout>
                            }
                        />
                        <Route
                            path="/geofence-alerts"
                            element={
                                <Layout>
                                    <ProtectedRoute element={<GeofenceAlerts />} isProtected={true} />
                                </Layout>
                            }
                        />
                        <Route
                            path="/add-vehicle"
                            element={
                                <Layout>
                                    <ProtectedRoute element={<AddVehicle />} isProtected={true} />
                                </Layout>
                            }
                        />
                        <Route
                            path="/drivers"
                            element={
                                <Layout>
                                    <ProtectedRoute element={<DriverPage />} isProtected={true} />
                                </Layout>
                            }
                        />
                        <Route
                            path="/add-geofence"
                            element={
                                <Layout>
                                    <ProtectedRoute element={<AddGeofence />} isProtected={true} />
                                </Layout>
                            }
                        />
                        <Route
                            path="/agency-profile"
                            element={
                                <Layout>
                                    <ProtectedRoute element={<AgencyProfilePage />} isProtected={isAuthenticated} />
                                </Layout>
                            }
                        />
                    </Routes>
                </Router>
            </AlertProvider>
        </AuthProvider>
    );
};

export default AppRouter;
