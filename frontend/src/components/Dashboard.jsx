import React, { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { decodeJWT } from '../utils/jwtDecode';
import './Dashboard.css';

const Dashboard = () => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        const leafletMap = L.map('map').setView([3.848, 11.5021], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        }).addTo(leafletMap);

        setMap(leafletMap);

        fetchVehicles(leafletMap);

        socket.on('vehicleUpdates', (updatedVehicles) => {
            const token = localStorage.getItem('token');
            const decoded = token ? decodeJWT(token) : null;
            const agencyId = decoded ? decoded.id : null;

            const filteredVehicles = updatedVehicles.filter(
                (vehicle) => vehicle.agencyId === agencyId
            );

            updateVehicleMarkers(filteredVehicles, leafletMap);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchVehicles = async (leafletMap) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/vehicles', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decoded = decodeJWT(token);
            const agencyId = decoded?.id;

            const filteredVehicles = response.data.filter(
                (vehicle) => vehicle.agencyId === agencyId
            );
            updateVehicleMarkers(filteredVehicles, leafletMap);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const updateVehicleMarkers = (vehicles, leafletMap) => {
        // Clear previous markers
        leafletMap.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                leafletMap.removeLayer(layer);
            }
        });

        // Add new markers with detailed info
        vehicles.forEach((vehicle) => {
            const { licensePlate, make, model } = vehicle;
            const popupContent = `
                <div>
                    <strong>License Plate:</strong> ${licensePlate}<br />
                    <strong>Make:</strong> ${make}<br />
                    <strong>Model:</strong> ${model}
                </div>
            `;

            L.marker([vehicle.location.latitude, vehicle.location.longitude])
                .addTo(leafletMap)
                .bindPopup(popupContent);
        });
    };

    return (
        <div className="dashboard">
            <div id="map"></div>
        </div>
    );
};

export default Dashboard;