const express = require('express');
const { createGeofence, getGeofences } = require('../controllers/geofenceController');
const { authenticate } = require('../controllers/vehicleController');

const router = express.Router();

// Protect the routes with the authenticate middleware
router.use(authenticate);

// CRUD operations for geofences
router.post('/', createGeofence); // Create a new geofence
router.get('/', getGeofences); // Retrieve all geofences for the agency

module.exports = router;