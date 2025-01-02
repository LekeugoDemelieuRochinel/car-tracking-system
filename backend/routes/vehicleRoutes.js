// backend/routes/vehicleRoutes.js

const express = require('express');
const {
    registerVehicle,
    getVehicles,
    getVehicleByLicensePlate, // Import the new function
    updateVehicle,
    deleteVehicle,
    authenticate
} = require('../controllers/vehicleController');

const router = express.Router();

// Protect the routes with the authenticate middleware
router.use(authenticate);

// CRUD operations
router.post('/', registerVehicle);                     // Register a new vehicle
router.get('/', getVehicles);                           // Retrieve all vehicles for the agency
router.get('/license/:licensePlate', getVehicleByLicensePlate); // Retrieve a specific vehicle by license plate
router.put('/:id', updateVehicle);                      // Update vehicle details
router.delete('/:id', deleteVehicle);                   // Delete a vehicle

module.exports = router;