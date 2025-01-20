const express = require('express');
const router = express.Router();
const {
    createDriver,
    getDrivers,
    updateDriver,
    associateDriverToVehicle,
    deleteDriver
} = require('../controllers/driverController');
const { authenticate } = require('../controllers/vehicleController');


// Protect the routes with the authenticate middleware
router.use(authenticate);
// Create a Driver
router.post('/', createDriver);

// Read all Drivers for an Agency
router.get('/', getDrivers);

// Update a Driver
router.put('/:id', updateDriver);

// Associate a Driver to a Vehicle
router.put('/:id/vehicle', associateDriverToVehicle);

// Delete a Driver
router.delete('/:id', deleteDriver);

module.exports = router;
