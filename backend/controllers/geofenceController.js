const Geofence = require('../models/Geofence');

// Create a new geofence
const createGeofence = async (req, res) => {
    const { name, boundaries } = req.body;

    try {
        const geofence = new Geofence({ name, boundaries, agencyId: req.agencyId });
        await geofence.save();
        res.status(201).json(geofence);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all geofences for the agency
const getGeofences = async (req, res) => {
    try {
        const geofences = await Geofence.find({ agencyId: req.agencyId });
        res.status(200).json(geofences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createGeofence,
    getGeofences
};