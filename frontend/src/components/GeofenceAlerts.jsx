// src/components/GeofenceAlerts.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../AlertContext'; // Import useAlerts

const GeofenceAlerts = () => {
    const { alerts } = useAlerts(); // Access alerts from context

    return (
        <div>
            <h1>Geofence Alerts</h1>
            {alerts.length === 0 ? (
                <p>No alerts available.</p>
            ) : (
                <ul>
                    {alerts.map((licensePlate, index) => (
                        <li key={index}>Vehicle {licensePlate} is out of bounds!</li>
                    ))}
                </ul>
            )}
            <Link to="/">Back to Dashboard</Link>
        </div>
    );
};

export default GeofenceAlerts;