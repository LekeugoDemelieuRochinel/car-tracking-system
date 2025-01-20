import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCar, FaMapMarkedAlt, FaBell, FaSignOutAlt, FaUserCircle, FaRoad, FaUserTie} from 'react-icons/fa'; // Adjust icons
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
            <FaMapMarkedAlt size={24} style={{ marginRight: '12px' }} />
            Map View
          </Link>
        </li>
        <li>
          <Link
            to="/add-vehicle"
            className={location.pathname === '/add-vehicle' ? 'active' : ''}
          >
            <FaCar size={26} style={{ marginRight: '12px' }} />
            Manage Vehicle
          </Link>
        </li>
        <li>
          <Link
            to="/drivers"
            className={location.pathname === '/drivers' ? 'active' : ''}
          >
            <FaUserTie size={20} style={{ marginRight: '12px' }} />
            Drivers
          </Link>
        </li>

        <li>
          <Link
            to="/add-geofence"
            className={location.pathname === '/add-geofence' ? 'active' : ''}
          >
            <FaRoad size={26} style={{ marginRight: '12px' }} />
            Manage Geofence
          </Link>
        </li>
        <li>
          <Link
            to="/geofence-alerts"
            className={location.pathname === '/geofence-alerts' ? 'active' : ''}
          >
            <FaBell size={24} style={{ marginRight: '12px' }} />
            Geofence Alerts
          </Link>
        </li>
        <li>
          <Link
            to="/agency-profile"
            className={location.pathname === '/agency-profile' ? 'active' : ''}
          >
            <FaUserCircle size={24} style={{ marginRight: '12px' }} />
            Profile
          </Link>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt size={18} style={{ marginRight: '10px' }} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
