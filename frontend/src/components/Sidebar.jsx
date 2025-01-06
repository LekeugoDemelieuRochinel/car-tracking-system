import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation(); // Get current route

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
    };

    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link 
                        to="/" 
                        className={location.pathname === '/' ? 'active' : ''} // Add active class dynamically
                    >
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/add-vehicle" 
                        className={location.pathname === '/add-vehicle' ? 'active' : ''} 
                    >
                        Manage Vehicles
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/add-geofence" 
                        className={location.pathname === '/add-geofence' ? 'active' : ''} 
                    >
                        Manage Geofences
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/geofence-alerts" 
                        className={location.pathname === '/geofence-alerts' ? 'active' : ''} 
                    >
                        Geofence Alerts
                    </Link>
                </li>
            </ul>
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
