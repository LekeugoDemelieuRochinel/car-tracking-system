import React, { useState } from 'react';
import axios from 'axios';

const GeofenceForm = ({ refreshGeofences }) => {
    const [name, setName] = useState('');
    const [boundaries, setBoundaries] = useState({ north: '', south: '', east: '', west: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/geofences', { name, boundaries }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refreshGeofences();
            setName('');
            setBoundaries({ north: '', south: '', east: '', west: '' });
        } catch (error) {
            alert('Error creating geofence: ' + error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Geofence</h2>
            <input type="text" placeholder="Geofence Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="North" value={boundaries.north} onChange={(e) => setBoundaries({ ...boundaries, north: e.target.value })} required />
            <input type="number" placeholder="South" value={boundaries.south} onChange={(e) => setBoundaries({ ...boundaries, south: e.target.value })} required />
            <input type="number" placeholder="East" value={boundaries.east} onChange={(e) => setBoundaries({ ...boundaries, east: e.target.value })} required />
            <input type="number" placeholder="West" value={boundaries.west} onChange={(e) => setBoundaries({ ...boundaries, west: e.target.value })} required />
            <button type="submit">Add Geofence</button>
        </form>
    );
};

export default GeofenceForm;