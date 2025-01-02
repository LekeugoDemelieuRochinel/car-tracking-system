const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');

// Middleware to check authentication
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.agencyId = decoded.id; // Store agency ID for later use
        next();
    });
};

const registerVehicle = async (req, res) => {
    const { licensePlate, make, model, location } = req.body;

    try {
        // Check for existing vehicle with the same license plate
        const existingVehicle = await Vehicle.findOne({ licensePlate, agencyId: req.agencyId });
        if (existingVehicle) {
            return res.status(400).json({ error: 'Vehicle with this license plate already exists' });
        }

        const newVehicle = new Vehicle({ 
            licensePlate, 
            make, 
            model, 
            location, 
            agencyId: req.agencyId 
        });
        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ agencyId: req.agencyId });
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// New function to get a vehicle by license plate
const getVehicleByLicensePlate = async (req, res) => {
    const { licensePlate } = req.params;

    try {
        const vehicle = await Vehicle.findOne({ licensePlate, agencyId: req.agencyId });
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found or not authorized' });
        }
        
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { _id: id, agencyId: req.agencyId },
            req.body,
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(404).json({ error: 'Vehicle not found or not authorized' });
        }
        res.status(200).json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedVehicle = await Vehicle.findOneAndDelete({ _id: id, agencyId: req.agencyId });
        if (!deletedVehicle) {
            return res.status(404).json({ error: 'Vehicle not found or not authorized' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerVehicle,
    getVehicles,
    getVehicleByLicensePlate,
    updateVehicle,
    deleteVehicle,
    authenticate
};