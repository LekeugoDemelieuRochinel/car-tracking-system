import React, { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import VehicleForm from './VehicleForm';
import GeofenceForm from './GeofenceForm';

const Dashboard = () => {
    const [map, setMap] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [geofences, setGeofences] = useState([]);

    useEffect(() => {
        const leafletMap = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(leafletMap);
        setMap(leafletMap);
        fetchVehicles(leafletMap); // Pass the map instance to fetchVehicles
        fetchGeofences(leafletMap); // Pass the map instance to fetchGeofences
    }, []);

    const fetchVehicles = async (leafletMap) => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/vehicles', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setVehicles(response.data);

        // Ensure the map instance is available before adding markers
        if (leafletMap) {
            response.data.forEach(vehicle => {
                L.marker([vehicle.location.latitude, vehicle.location.longitude]).addTo(leafletMap)
                    .bindPopup(vehicle.licensePlate);
            });
        }
    };

    const fetchGeofences = async (leafletMap) => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/geofences', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setGeofences(response.data);

        // Ensure the map instance is available before adding rectangles
        if (leafletMap) {
            response.data.forEach(geofence => {
                const bounds = [
                    [geofence.boundaries.south, geofence.boundaries.west],
                    [geofence.boundaries.north, geofence.boundaries.east]
                ];
                L.rectangle(bounds, { color: '#ff7800', weight: 1 }).addTo(leafletMap)
                    .bindPopup(geofence.name);
            });
        }
    };

    return (
        <>
            <h1>Dashboard</h1>
            <VehicleForm refreshVehicles={fetchVehicles} />
            <GeofenceForm refreshGeofences={fetchGeofences} />
            <div id="map" style={{ height: '500px' }}></div>
        </>
    );
};

export default Dashboard;