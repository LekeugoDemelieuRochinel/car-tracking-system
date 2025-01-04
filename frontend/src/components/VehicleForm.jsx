import React, { useState } from 'react';
import axios from 'axios';

const VehicleForm = ({ refreshVehicles }) => {
    const [licensePlate, setLicensePlate] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/vehicles', { licensePlate, make, model, location }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refreshVehicles();
            setLicensePlate('');
            setMake('');
            setModel('');
            setLocation('');
        } catch (error) {
            alert('Error adding vehicle: ' + error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Vehicle</h2>
            <input type="text" placeholder="License Plate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} required />
            <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required />
            <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <button type="submit">Add Vehicle</button>
        </form>
    );
};

export default VehicleForm;